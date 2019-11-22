export default class ContentService {

	// types

	types = {
		CONTENT_START: `CONTENT_START`,
		CONTENT_ABORT: `CONTENT_ABORT`,
		CONTENT_CLEAN: `CONTENT_CLEAN`,
		CONTENT_ERROR: `CONTENT_ERROR`,
		CONTENT_GET: `CONTENT_GET`,
	}

	// action creators

	actions = {
		contentStart: () => ({ type: this.types.CONTENT_START }),
		contentAbort: () => ({ type: this.types.CONTENT_ABORT }),
		contentClean: () => ({ type: this.types.CONTENT_CLEAN }),
		contentError: error => ({ type: this.types.CONTENT_ERROR, payload: { error } }),
		contentGet: content => ({ type: this.types.CONTENT_GET, payload: { content } }),
	}

	// default store

	store = {
		cache: {},
		loading: false,
		lastFetched: 0,
	}

	// reducer

	reducer = (store = this.store, action) => {

		const {
			CONTENT_START,
			CONTENT_ABORT,
			CONTENT_CLEAN,
			CONTENT_ERROR,
			CONTENT_GET,
		} = this.types

		switch (action.type) {

		case CONTENT_START:
			return {
				...store,
				loading: true,
			}

		case CONTENT_ABORT:
			return {
				...store,
				loading: false,
			}

		case CONTENT_CLEAN:
			return {
				...store,
				cache: {},
			}

		case CONTENT_ERROR:
			console.error(action.payload.error)
			return {
				...store,
				loading: false,
			}

		case CONTENT_GET:
			return {
				...store,
				cache: {
					...store.cache,
					...action.payload.content,
				},
				loading: false,
				lastFetched: Date.now(),
			}

		default:
			return store
		}
	}

	// thunks

	getContent = (contentIds = [], force = false) => async (dispatch, getState, { apiProxy }) => {

		console.log(contentIds)

		const time = Date.now() - getState().contentStore.lastFetched

		const stale = time >= process.env.REACT_APP_STALE_TIME

		const { cache } = getState().contentStore
		const cachedIds = Object.keys(cache).map(id => parseInt(id))
		const notCached = contentIds.filter(id => !cachedIds.includes(id))

		if (stale || notCached.length || force) {

			dispatch(this.actions.contentStart())

			try {

				const result = await apiProxy.content.get(notCached)

				dispatch(this.actions.contentGet(result))

			} catch (error) {
				console.error(error.message)
				dispatch(this.actions.contentError(error))
			}

		} else dispatch(this.actions.contentAbort())
	}

}