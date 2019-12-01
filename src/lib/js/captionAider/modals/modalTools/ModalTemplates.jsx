import React from 'react'
// TODO: Where is SuperSelect from?
import { SuperSelect } from 'yvideo-editorwidgets' // or 'editor-widgets'

const EditTrackDataTemplate = (props) => {

	let trackSelect = ``
	if(props.trackList === 0) trackSelect = `There are no tracks loaded for editing`
	else if (props.trackList > 1) {
		trackSelect = (
			<div class='control-group'>
				<label class='control-label'>Which Track</label>
				<div class='controls'>
					<select onChange={props.changeTrackToEdit} value={props.trackToEdit}>
						{props.trackList.map( track => <option value={track}>{track}</option> )}
					</select>
				</div>
			</div>
		)
	}

	return (
		<span class='form-horizontal'>
			{trackSelect}
			<div style={{display: props.trackToEdit === `` ? `none` : `block`}}>
				<div class='control-group'>
					<label class='control-label'>Name</label>
					<div class='controls'>
						<input type='text' value={props.trackName} placeholder='Name' id='editTrackAutoFocus'/>
					</div>
				</div>
				<TrackKindSelect trackKind={props.trackKind}/>
				<TrackLangSelect track={props.track}/>
			</div>
		</span>
	)
}

/*
 <script id='editTrackTemplate' type='text/ractive'>
        <span class="form-horizontal">
            {{#(trackList.length === 0)}}
            There are no tracks loaded for editing.
            {{/(trackList)}}
            {{#(trackList.length > 0)}}
            {{#(trackList.length > 1)}}
            <div class="control-group">
                <label class="control-label">Which Track</label>
                <div class="controls">
                    <select value="{{trackToEdit}}">
                    {{#trackList}}<option value="{{.}}">{{.}}</option>{{/trackList}}
                    </select>
                </div>
            </div>
            {{/(trackList)}}
            <div style="display:{{(trackToEdit === "" ? "none" : "block")}}">
                <div class="control-group">
                    <label class="control-label">Name</label>
                    <div class="controls">
                        <input type="text" value="{{trackName}}" placeholder="Name" id="editTrackAutofocus">
                    </div>
                </div>
                {{>trackKindSelect}}
                {{>trackLangSelect}}
            </div>
            {{/(trackList)}}
        </span>
</script>
*/

const SetLocationTemplate = props => {
	<span class='form-horizontal'>
		<div class='container'>
			<div class='control-group'>
				<label class='control-label'>Current Save Location</label>
				<div class='controls'>
					<div id='saveLocation'>
						<label class='radio'>
							<input type='radio' names={props.saveLocation} value='server'/>Server
						</label>
						{props.saveLocations.map( saveLocation => {
							<label class='radio'>
								<input type='radio' name={props.saveLocation} value={saveLocation.value}/>{saveLocation.name}
							</label>
						})}
					</div>
				</div>
			</div>
		</div>
	</span>
}

/*
<script id='setLocTemplate' type='text/ractive'>
	<span class="form-horizontal">
			<div class="container">
					<div class="control-group">
							<label class="control-label">Current Save Location</label>
							<div class="controls">
									<div id="saveLocation">

											<label class="radio">
													<input type="radio" name="{{saveLocation}}" value="server">Server
											</label>
											{{#saveLocations}}
											<label class="radio">
													<input type="radio" name="{{saveLocation}}" value="{{.value}}">{{.name}}
											</label>
											{{/saveLocations}}
									</div>
							</div>
					</div>
			</div>
	</span>
</script>
*/

const LoadTrackDataTemplate = props => {
	return (
		<span class='form-horizontal'>
			<TrackKindSelect trackKind={props.track.trackKind}/>
			<TrackLangSelect track={props.track}/>
			<div class='control-group'>
				<label class='control-label'>Source</label>
				<div class='controls'>
					{props.sources.map( source => {
						return (
							<label class='radio'>
								<input type='radio' name={props.loadSource} value={source.name}>{source.label}</input>
							</label>
						)
					})}
				</div>
			</div>
		</span>
	)
}

/*
<script id='loadTrackTemplate' type='text/ractive'>
        <span class="form-horizontal">
            {{>trackKindSelect}}
            {{>trackLangSelect}}
            <div class="control-group">
                <label class="control-label">Source</label>
                <div class="controls">
                    {{#sources}}
                    <label class="radio"><input type="radio" name="{{loadSource}}" value="{{.name}}">{{.label}}</label>
                    {{/sources}}
                </div>
            </div>
        </span>
		</script>
*/

const CreateTrackTemplate = props => {
	return (
		<span class='form-horizontal'>
			<div class='control-group'>
				<label class='control-label'>Name</label>
				<div class='controls'>
					<input type='text' value={props.trackName} placeholder='Name' id='createTrackAutofocus' />
				</div>
			</div>
			<TrackKindSelect />
			<div class='control-group'>
				<label class='control-label'>Format</label>
				<div class='controls'>
					<select value={props.trackMime}>
						{props.types.map( type => <option value={type.mime}>{type.name}</option> )}
					</select>
				</div>
			</div>
		</span>
	)
}

/*
<script id='createTrackTemplate' type='text/ractive'>
    <span class="form-horizontal">
        <div class="control-group">
            <label class="control-label">Name</label>
            <div class="controls">
                <input type="text" value="{{trackName}}" placeholder="Name" id="createTrackAutofocus">
            </div>
        </div>
        {{>trackKindSelect}}
        <div class="control-group">
            <label class="control-label">Format</label>
            <div class="controls">
                <select value="{{trackMime}}">
                    {{#types}}<option value="{{.mime}}">{{.name}}</option>{{/types}}
                </select>
            </div>
        </div>
        {{>trackLangSelect}}
    </span>
</script>
*/

const SaveTrackTemplate = props => {
	return (
		<div class='form-horizontal'>
			<SuperSelect icon='icon-laptop' text='Select Track' value={props.selectedTracks} button='left' open={props.selectOpen} multiple='true' options={props.tracks} modal={props.modalId}/>
		</div>
	)
}

/*
<script id='saveTrackTemplate' type='text/ractive'>
        <div class="form-horizontal">
            <SuperSelect icon="icon-laptop" text="Select Track" value="{{selectedTracks}}" button="left" open="{{selectOpen}}" multiple="true" options="{{tracks}}" modal="{{modalId}}">
        </div>
    </script>
*/

const ShowTrackTemplate = props => {
	return (
		<span class='form-horizontal'>
			<SuperSelect icon='icon-laptop' text='Select Track' value={props.selectedTracks} button='left' open={props.selectOpen} multiple='true' options={props.tracks} modal={props.modalId}/>
		</span>
	)
}

/*
<script id='showTrackTemplate' type='text/ractive'>
    <span class="form-horizontal">
        <SuperSelect icon="icon-laptop" text="Select Track" value="{{selectedTracks}}" button="left" open="{{selectOpen}}" multiple="true" options="{{tracks}}" modal="{{modalId}}">
    </span>
</script>
*/

const TrackKindSelect = ({ trackKind }) => {
	return (
		<div class='form-group'>
			<label class='control-label'>Kind</label>
			<div class='controls'>
				<select value={trackKind}>
					<option value='subtitles' selected>Subtitles</option>
					<option value='captions'>Captions</option>
					<option value='descriptions'>Descriptions</option>
					<option value='chapters'>Chapters</option>
					<option value='metadata'>Metadata</option>
				</select>
			</div>
		</div>
	)
}

/*
Ractive.partials.trackKindSelect = '<div class="form-group">\
    <label class="control-label">Kind</label>\
    <div class="controls">\
        <select value="{{trackKind}}">\
            <option value="subtitles" selected>Subtitles</option>\
            <option value="captions">Captions</option>\
            <option value="descriptions">Descriptions</option>\
            <option value="chapters">Chapters</option>\
            <option value="metadata">Metadata</option>\
        </select>\
    </div>\
</div>';
*/

const TrackLangSelect = ({ track }) => {
	return (
		<div class='form-group'>
			<label class='control-label'>Language</label>
			<div class='controls'>
				<SuperSelect icon='icon-globe' text='Select Language' value={track.trackLang} button='left' open={track.selectOpen} multiple='false' options={track.languages} modal={track.modalId} defaultOption={{value:`zxx`,text:`No Linguistic Content`}}/>
			</div>
		</div>
	)
}

/*
Ractive.partials.trackLangSelect = '<div class="form-group">\
    <label class="control-label">Language</label>\
    <div class="controls">\
        <SuperSelect icon="icon-globe" text="Select Language" value="{{trackLang}}" button="left" open="{{selectOpen}}" multiple="false" options="{{languages}}" modal="{{modalId}}" defaultOption={{defaultOption}}>\
    </div>\
</div>';
*/

export default {
	EditTrackDataTemplate,
	SetLocationTemplate,
	LoadTrackDataTemplate,
	CreateTrackTemplate,
	SaveTrackTemplate,
	ShowTrackTemplate,
}

