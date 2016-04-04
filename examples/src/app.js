/* eslint react/prop-types: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select-plus';

import Contributors from './components/Contributors';
import CustomComponents from './components/CustomComponents';
import CustomRender from './components/CustomRender';
import GroupedOptionsField from './components/GroupedOptionsField';
import Multiselect from './components/Multiselect';
import NumericSelect from './components/NumericSelect';
import Cities from './components/Cities';
import States from './components/States';

ReactDOM.render(
	<div>
		<Cities label="Cities" searchable />
		<States label="States" searchable />
		<Multiselect label="Multiselect" />
		<Contributors label="Contributors (Async)" />
		<NumericSelect label="Numeric Values" />
		<GroupedOptionsField label="Option Groups" />
		<CustomRender label="Custom Render Methods"/>
		<CustomComponents label="Custom Placeholder, Option and Value Components" />
		{/*
		<SelectedValuesField label="Option Creation (tags mode)" options={FLAVOURS} allowCreate hint="Enter a value that's NOT in the list, then hit return" />
		*/}
	</div>,
	document.getElementById('example')
);
