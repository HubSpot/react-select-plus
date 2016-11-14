/* eslint react/prop-types: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select-plus';

import Creatable from './components/Creatable';
import Contributors from './components/Contributors';
import GithubUsers from './components/GithubUsers';
import CustomComponents from './components/CustomComponents';
import CustomRender from './components/CustomRender';
import GroupedOptionsField from './components/GroupedOptionsField';
import GroupedOptionsFieldWithGroupSelect from './components/GroupedOptionsFieldWithGroupSelect';
import Multiselect from './components/Multiselect';
import NumericSelect from './components/NumericSelect';
import Virtualized from './components/Virtualized';
import States from './components/States';

ReactDOM.render(
	<div>
		<States label="States" searchable />
		<Multiselect label="Multiselect" />
		<Virtualized label="Virtualized" />
		<Contributors label="Contributors (Async)" />
		<GithubUsers label="Github users (Async with fetch.js)" />
		<NumericSelect label="Numeric Values" />
		<GroupedOptionsField label="Option Groups" />
		<GroupedOptionsFieldWithGroupSelect label="Option Groups with Group Select" />
		<CustomRender label="Custom Render Methods"/>
		<CustomComponents label="Custom Placeholder, Option, Value, and Arrow Components" />
		<Creatable
			hint="Enter a value that's NOT in the list, then hit return"
			label="Custom tag creation"
		/>
	</div>,
	document.getElementById('example')
);
