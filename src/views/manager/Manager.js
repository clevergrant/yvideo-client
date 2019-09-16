import plus from 'assets/collections/plus.svg'
import AccordionMenu from 'components/accordionMenu/AccordionMenu'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { adminOff, adminOn, getCollections, load, loaded, toggleModal } from 'redux/actions'
import Editor from './editor/Editor'
import CreateCollection from 'components/forms/CreateCollection'
import { Body, Container, CreateButton, NoCollection, Plus, SideMenu } from './styles'

class Manager extends Component {

	componentDidMount = () => {
		const { getCollections, adminOn, user = { permissions: [] } } = this.props
		const privileged = user.permissions.includes(`admin`)
		getCollections(privileged)
		adminOn()
	}

	shouldComponentUpdate = nextProps => {
		const { collectionsCache, match } = this.props
		const update = collectionsCache !== nextProps.collectionsCache || match.params.id !== nextProps.match.params.id
		return update
	}

	componentWillUnmount() {
		const { adminOff, load } = this.props
		load()
		adminOff()
	}

	createNew = async () => {
		this.props.toggleModal({ component: CreateCollection })
	}

	render() {

		const { collectionsCache, match, loaded } = this.props
		const { collections } = collectionsCache

		const sideLists = {
			published: [],
			unpublished: [],
			archived: []
		}

		Object.keys(collections).forEach(id => {
			const { archived, published, name } = collections[id]

			if (archived) sideLists.archived.push({ id, name })
			else if (published) sideLists.published.push({ id, name })
			else sideLists.unpublished.push({ id, name })
		})

		if (!collectionsCache.isFetching) loaded()

		return (
			<Container>
				<SideMenu>

					<h4>My Collections</h4>

					<AccordionMenu header={`Published`} active>
						{sideLists.published.map(({ id, name }, index) => <Link key={index} to={`/manager/${id}`}>{name}</Link>)}
					</AccordionMenu>

					<AccordionMenu header={`Unpublished`} active>
						{sideLists.unpublished.map(({ id, name }, index) => <Link key={index} to={`/manager/${id}`}>{name}</Link>)}
					</AccordionMenu>

					{
						this.props.user.permissions.includes(`admin`) && <AccordionMenu header={`Archived`}>
							{sideLists.archived.map(({ id, name }, index) => <Link key={index} to={`/manager/${id}`}>{name}</Link>)}
						</AccordionMenu>
					}

					<CreateButton onClick={this.createNew}><Plus src={plus} />Create New Collection</CreateButton>

				</SideMenu>
				<Body>
					{match.params.id === null || match.params.id === undefined ?
						<NoCollection>Select a Collection to get started.</NoCollection>
						:
						<Editor collectionId={match.params.id} />
					}
				</Body>
			</Container>
		)
	}
}

const mapStateToProps = ({ collectionsCache, editMode, user }) => ({ collectionsCache, editMode, user })

const mapDispatchToProps = {
	toggleModal,
	getCollections,
	load,
	loaded,
	adminOn,
	adminOff
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Manager))