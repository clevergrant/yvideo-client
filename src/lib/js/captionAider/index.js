import ContentRenderer from 'lib/js/contentRendering/ContentRenderer'
import { Ayamel, Translator } from 'yvideojs'
import { CaptionEditor, Timeline } from 'yvideo-subtitle-timeline-editor'
// import { AudioTrack, CaptionEditor, Resampler, Slider, TextTrack, Timeline, TimelineControls, TimelineMenus, TimelineShortcuts, TimelineSkin, TimelineView, WaveForm } from 'yvideo-subtitle-timeline-editor'
import { CommandStack } from 'yvideo-editorwidgets'

import {
	EditTrackData,
	/* GetLocation,*/
	GetLocationNames,
	/* LoadAudio,
	LoadTrackData,
	LoadTranscript,*/
	NewTrackData,
	/* SaveTrackData,
	ShowTrackData,*/
} from './modals'

const getCaptionAider = async (content, resource, contentHolder) => {

	const langList = Object.keys(Ayamel.utils.p1map)
		.map(p1 => {

			const code = Ayamel.utils.p1map[p1]
			const engname = Ayamel.utils.getLangName(code,`eng`)
			const localname = Ayamel.utils.getLangName(code,code)

			return {
				value: code,
				text: engname,
				desc: localname !== engname ? localname : void 0,
			}
		})

	try {

		content.settings.showCaptions = `true`

		ContentRenderer.render({
			content,
			resource,

			getTranscriptWhitelist: () => {
				return Promise.resolve([])
			},

			contentId: content.id,
			holder: contentHolder,
			permission: `edit`,
			screenAdaptation: {
				fit: true,
				scroll: true,
				padding: 61,
			},
			startTime: 0,
			endTime: -1,
			renderCue: CaptionEditor.make,
			// noUpdate: true, // Disable transcript player updating for now

			callback: args => {
				const translator = new Translator()

				const commandStack = new CommandStack()

				const {
					trackMimes,
					mainPlayer,
				} = args

				const timeline = new Timeline(document.getElementById(`timeline`), {
					stack: commandStack,
					syncWith: mainPlayer,
					saveLocation: `server`,
					dropLocation: `file`,

					width: document.getElementById(`timeline`).offsetWidth || window.innerWidth - 100,
					length: 3600, start: 0, end: 240,

					trackMode: `showing`,
					tool: Timeline.SELECT,
					showControls: true,
					canGetFor: key => {
						switch(key) {
						case `newtrack`:
						case `edittrack`:
						case `savetrack`:
						case `loadtrack`:
						case `showtrack`:
						case `loadlines`:
						case `loadaudio`:
						case `location`:
						case `locationNames`:
							return true
						default:
							return false
						}
					},
					getFor: (key, datalist) => {
						switch (key) {
						case `newtrack`:

							// TODO: Create a component that renders what newTrackData() rendered, which you can see on the github repo:
							// https://github.com/BYU-ODH/yvideo/blob/master/public/javascripts/pageScripts/captionAider.js
							// TODO: Import that component here, and pass it into the renderModal() function.
							// TODO: Learn how to add props to the component before passing it on to the toggleModal() redux thunk method
							// (hint: you might be able to do it with something called the "render prop". Google that.)

							// TODO: So i didn't account for what newTrackData() actually returns, so check to see what that is, and see if there's any way to copy it the Reactful way :)

							// return newTrackData(datalist)
							return NewTrackData(datalist)
						case `edittrack`:
							return EditTrackData(datalist, timeline, langList)
							/* case `savetrack`:
							return SaveTrackData(datalist, timeline, langList)
						case `loadtrack`:
							return LoadTrackData(datalist, timeline, langList)
						case `showtrack`:
							return ShowTrackData(datalist, timeline, langList)
						case `loadlines`:
							return LoadTranscript(datalist, timeline, langList)
						case `loadaudio`:
							return LoadAudio(datalist, timeline, langList)
						case `location`:
							return GetLocation(datalist, timeline, langList)*/
						case `locationNames`:
							return GetLocationNames(datalist)
						default:
							return Promise.reject(new Error(`Can't get data for ${key}`))
						}
					},
				})

				const updateSpacing = () => {
					document.getElementById(`bottomSpacer`).style.marginTop = `${document.getElementById(`bottomContainer`).clientHeight}px`
				}

				// Never used
				CaptionEditor({
					stack: commandStack,
					refresh() {
						mainPlayer.refreshLayout()
					},
					rebuild() {
						mainPlayer.rebuildCaptions()
					},
					timeline,
				})

				// Check for unsaved tracks before leaving
				window.addEventListener(`beforeunload`, (e) => {
					const warning = `You have unsaved tracks. Your unsaved changes will be lost.`
					if (!commandStack.isSavedAt(timeline.saveLocation)) {
						e.returnValue = warning
						return warning
					}
				}, false)

				window.addEventListener(`resize`, () => {
					timeline.width = window.innerWidth
				}, false)

				// Preload tracks into the editor
				mainPlayer.addEventListener(`addtexttrack`, (event) => {
					const track = event.detail.track
					if (timeline.hasCachedTextTrack(track)) return
					timeline.cacheTextTrack(track, trackMimes.get(track), `server`)
				})

				// EVENT TRACK EDITOR event listeners
				timeline.on(`select`, (selected) => {
					selected.segments[0].makeEventTrackEditor(selected.segments[0].cue, mainPlayer)
				})

				timeline.on(`unselect`, (deselected) => {
					deselected.segments[0].destroyEventTrackEditor()
				})

				// Auto delete eventTrackEditor when track is deleted
				timeline.on(`delete`, (deleted) => {
					deleted.segments[0].destroyEventTrackEditor()
				})

				// keep the editor and the player menu in sync
				timeline.on(`altertrack`, () => {
					mainPlayer.refreshCaptionMenu()
				})

				// TODO: Integrate the next listener into the timeline editor
				timeline.on(`activechange`, () => {
					mainPlayer.rebuildCaptions()
				})

				timeline.on(`cuechange`, (evt) => {
					if (evt.fields.indexOf(`text`) === -1) return
				})

				timeline.on(`addtrack`, (evt) => {
					mainPlayer.addTextTrack(evt.track.textTrack)
					updateSpacing()
				})

				timeline.on(`removetrack`, (evt) => {
					updateSpacing()
				})

				timeline.addMenuItem([`Track`, `Clone`, `Clone with Translation`], {
					name: `Clone with Translation`,
					action() {
						const tl = this.timeline,
							tid = this.track.id
						tl.getFor(`newtrack`,
							[`kind`, `lang`, `name`, `mime`, `overwrite`],
							{
								kind: void 0,
								lang: void 0,
								mime: void 0,
								overwrite: false,
							}
						).then((values) => {
							tl.cloneTrack(
								tid,
								{
									kind: values[0],
									lang: values[1],
									name: values[2],
									mime: values[3],
								},
								(cue, ott, ntt, mime) => {
									const txt = Ayamel.utils.extractPlainText(cue.getCueAsHTML())

									if (ott.language === ntt.language)
										return txt

									return translator.translate({
										srcLang: ott.language,
										destLang: ntt.language,
										text: txt,
									}).then((data) => {
										return data.translations[0].text
									}).catch(() => {
										return txt
									})
								},
								values[4]
							)
						})
					},
				})
			},
		})

	} catch (error) {
		console.error(error)
	}
}

export default getCaptionAider