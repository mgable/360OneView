"use strict";

var scenarioId = 10,
	cubeId = 3,
	cubeName = 'CMP Intent',
	elementId = 23,
	dimensionId = 1,
	hierarchyId = 4,
	levelId = 5,
	viewId = 9,
	views = [
		{
			"id": 9,
			"name": "Default Competitive Intent view",
			"isDefault": true,
			"auditInfo": {
				"createdOn": "2015-03-10T22:38:23.368Z",
				"createdBy": {
					"uuid": "UUID-1",
					"name": "me"
				}
			}
		}
	],
	scenarioElement = {
		"id": 22,
		"name": "Competitive Intent - November 15 2015 Preloaded Simulation vFinal",
		"description": "Non-Marketing Drivers - November 15 2015 Preloaded Simulation vFinal ( 124 )",
		"group": "Non-Marketing Drivers",
		"cubeMeta": {
			"id": 3,
			"name": "CMP Intent",
			"label": "Competitive Intent"
		},
		"auditInfo": {
			"lastUpdatedOn": "2015-03-09T10:10:50.964Z",
			"lastUpdatedBy": {
				"uuid": "system",
				"name": "me"
			}
		}
	},
	scenarioElementModified = {
		"id": 42,
		"name": "Test scenario element name",
		"description": "Test description",
		"group": "Non-Marketing Drivers",
		"cubeMeta": {
			"id": 3,
			"name": "CMP Intent",
			"label": "Competitive Intent"
		},
		"auditInfo": {
			"lastUpdatedOn": "2015-03-09T10:10:50.964Z",
			"lastUpdatedBy": {
				"uuid": "system",
				"name": "me"
			}
		}
	},
	scenarioElements = [
		{
			"id": 21,
			"name": "Competitive Incentive (PNVS) Spend - November 15 2015 Preloaded Simulation vFinal",
			"description": "Non-Marketing Drivers - November 15 2015 Preloaded Simulation vFinal ( 124 )",
			"group": "Non-Marketing Drivers",
			"cubeMeta": {
				"id": 2,
				"name": "CMP Incentive Spend",
				"label": "Competitive Incentive (PNVS) Spend"
			},
			"auditInfo": {
				"lastUpdatedOn": "2015-03-09T10:10:49.194Z",
				"lastUpdatedBy": {
					"uuid": "system",
					"name": "me"
				}
			}
		},
		{
			"id": 22,
			"name": "Competitive Intent - November 15 2015 Preloaded Simulation vFinal",
			"description": "Non-Marketing Drivers - November 15 2015 Preloaded Simulation vFinal ( 124 )",
			"group": "Non-Marketing Drivers",
			"cubeMeta": {
				"id": 3,
				"name": "CMP Intent",
				"label": "Competitive Intent"
			},
			"auditInfo": {
				"lastUpdatedOn": "2015-03-09T10:10:50.964Z",
				"lastUpdatedBy": {
					"uuid": "system",
					"name": "me"
				}
			}
		},
		{
			"id": 23,
			"name": "Competitive Marketshare - November 15 2015 Preloaded Simulation vFinal",
			"description": "Non-Marketing Drivers - November 15 2015 Preloaded Simulation vFinal ( 124 )",
			"group": "Non-Marketing Drivers",
			"cubeMeta": {
				"id": 4,
				"name": "CMP Marketshare",
				"label": "Competitive Marketshare"
			},
			"auditInfo": {
				"lastUpdatedOn": "2015-03-09T10:10:51.038Z",
				"lastUpdatedBy": {
					"uuid": "system",
					"name": "me"
				}
			}
		},
		{
			"id": 24,
			"name": "Competitive Product Lifecycle - November 15 2015 Preloaded Simulation vFinal",
			"description": "Non-Marketing Drivers - November 15 2015 Preloaded Simulation vFinal ( 124 )",
			"group": "Non-Marketing Drivers",
			"cubeMeta": {
				"id": 5,
				"name": "CMP Product Lifecycle",
				"label": "Competitive Product Lifecycle"
			},
			"auditInfo": {
				"lastUpdatedOn": "2015-03-09T10:10:52.866Z",
				"lastUpdatedBy": {
					"uuid": "system",
					"name": "me"
				}
			}
		},
		{
			"id": 26,
			"name": "GQV - November 15 2015 Preloaded Simulation vFinal",
			"description": "Non-Marketing Drivers - November 15 2015 Preloaded Simulation vFinal ( 124 )",
			"group": "Non-Marketing Drivers",
			"cubeMeta": {
				"id": 8,
				"name": "GQV",
				"label": "GQV"
			},
			"auditInfo": {
				"lastUpdatedOn": "2015-03-09T10:10:54.091Z",
				"lastUpdatedBy": {
					"uuid": "system",
					"name": "me"
				}
			}
		},
		{
			"id": 29,
			"name": "Product Lifecycle - November 15 2015 Preloaded Simulation vFinal",
			"description": "Non-Marketing Drivers - November 15 2015 Preloaded Simulation vFinal ( 124 )",
			"group": "Non-Marketing Drivers",
			"cubeMeta": {
				"id": 11,
				"name": "Product Lifecycle",
				"label": "Product Lifecycle"
			},
			"auditInfo": {
				"lastUpdatedOn": "2015-03-09T10:10:54.322Z",
				"lastUpdatedBy": {
					"uuid": "system",
					"name": "me"
				}
			}
		},
		{
			"id": 149,
			"name": "Marketing Plan - Calculation Test 34",
			"description": "Marketing Plan- Calculation Test 34 ( 48 )",
			"group": "Marketing Plan",
			"cubeMeta": {
				"id": 1,
				"name": "TOUCHPOINT",
				"label": "Marketing Plan"
			},
			"auditInfo": {
				"lastUpdatedOn": "2015-03-13T19:46:40.618Z",
				"lastUpdatedBy": {
					"uuid": "UUID-1",
					"name": "me"
				}
			}
		}
	],
	cubeMeta = '{"id": 3,"name": "CMP Intent","label": "Competitive Intent","dimensions": [{"type": "MeasureDimension","id": 1,"name": "VAR_DIM","label": "VARIABLE","hierarchies": [{"id": 4,"name": "Competitive Intent","label": "Competitive Intent","levels": [{"name": "VAR_ID","id": 5,"label": "Competitive Intent","ragged": false}]}],"aggregatable": true},{"type": "StandardDimension","id": 2,"name": "PROD_DIM","label": "PRODUCT","hierarchies": [{"id": 16,"name": "Nameplate Category","label": "Nameplate Category","levels": [{"name": "ATTR1_ID","id": 2,"label": "Nameplate Category","ragged": false},{"name": "PROD_ID","id": 1,"label": "Nameplate","ragged": false}]}]},{"type": "TimeDimension","id": 4,"name": "TIME_DIM","label": "TIME","hierarchies": [{"id": 18,"name": "YEAR","label": "YEAR","levels": [{"name": "YEAR","id": 1,"label": "YEAR","ragged": false},{"name": "HALF YEARLY","id": 2,"label": "HALF YEARLY","ragged": false},{"name": "QUARTER","id": 4,"label": "QUARTER","ragged": false},{"name": "MONTH","id": 5,"label": "MONTH","ragged": false}]}]}],"measures": [{"id": 3,"name": "CMP Intent","label": "CMP Intent"}]}',
	levelMembers = {
		"type": "HierarchicalMemberData",
		"dimension": {
			"id": 1,
			"name": "VAR_DIM",
			"label": "VARIABLE"
		},
		"hierarchy": {
			"id": 4,
			"name": "Competitive Intent",
			"label": "Competitive Intent"
		},
		"members": [
			{
				"id": 113,
				"name": "BT_FAV_CP3_PCT",
				"label": "Favorable Opinion - Competitor 3",
				"members": [],
				"visible": true,
				"na": false
			},
			{
				"id": 111,
				"name": "BT_FAV_CP2_PCT",
				"label": "Favorable Opinion - Competitor 2",
				"members": [],
				"visible": true,
				"na": false
			},
			{
				"id": 109,
				"name": "BT_FAV_CP1_PCT",
				"label": "Favorable Opinion - Competitor 1",
				"members": [],
				"visible": true,
				"na": false
			}
		]
	},
	cubeScenarioElements = '[{"id":22,"name":"Competitive Intent - November 15 2015 Preloaded Simulation vFinal","description":"Non-Marketing Drivers - November 15 2015 Preloaded Simulation vFinal ( 124 )","group":"Non-Marketing Drivers","cubeMeta":{"id":3,"name":"CMP Intent","label":"Competitive Intent"},"auditInfo":{"lastUpdatedOn":"2015-03-09T10:10:50.964Z","lastUpdatedBy":{"uuid":"system","name":"me"}}},{"id":8,"name":"Competitive Intent - August 15 2015 PRELOADED CURRENT PLAN vACP","description":"Non-Marketing Drivers - August 15 2015 PRELOADED CURRENT PLAN vACP ( 1 )","group":"Non-Marketing Drivers","cubeMeta":{"id":3,"name":"CMP Intent","label":"Competitive Intent"},"auditInfo":{"lastUpdatedOn":"2015-03-09T10:10:40.478Z","lastUpdatedBy":{"uuid":"system","name":"me"}}}]',
	pivotSlice = '[[{"key":{"value":{"coordinates":{"rowAddresses":[{"scope":{"dimension":{"id":5,"name":"CHNL_DIM","label":"CHANNEL"},"hierarchy":{"id":-1},"level":{"id":1,"name":"CHNL_ID","label":"Channel"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":1,"name":"All Channels","label":"All Channels"}]}}}],"columnAddresses":[{"scope":{"dimension":{"id":6,"name":"TIME_DIM","label":"TIME"},"hierarchy":{"id":-1},"level":{"id":1,"name":"YEAR","label":"YEAR"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":224,"name":"2015","label":"2015"}]}}}]}}},"value":{"value":1.4672047554394126E8},"format":{"format":"#,###","currency":"$"}}],[{"key":{"value":{"coordinates":{"rowAddresses":[{"scope":{"dimension":{"id":5,"name":"CHNL_DIM","label":"CHANNEL"},"hierarchy":{"id":-1},"level":{"id":1,"name":"CHNL_ID","label":"Channel"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":2,"name":"Direct Offline","label":"Direct Offline"}]}}}],"columnAddresses":[{"scope":{"dimension":{"id":6,"name":"TIME_DIM","label":"TIME"},"hierarchy":{"id":-1},"level":{"id":1,"name":"YEAR","label":"YEAR"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":224,"name":"2015","label":"2015"}]}}}]}}},"value":{"value":0.0},"format":{"format":"#,###","currency":"$"}}],[{"key":{"value":{"coordinates":{"rowAddresses":[{"scope":{"dimension":{"id":5,"name":"CHNL_DIM","label":"CHANNEL"},"hierarchy":{"id":-1},"level":{"id":1,"name":"CHNL_ID","label":"Channel"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":4,"name":"Direct Online","label":"Direct Online"}]}}}],"columnAddresses":[{"scope":{"dimension":{"id":6,"name":"TIME_DIM","label":"TIME"},"hierarchy":{"id":-1},"level":{"id":1,"name":"YEAR","label":"YEAR"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":224,"name":"2015","label":"2015"}]}}}]}}},"value":{"value":1962858.10564},"format":{"format":"#,###","currency":"$"}}],[{"key":{"value":{"coordinates":{"rowAddresses":[{"scope":{"dimension":{"id":5,"name":"CHNL_DIM","label":"CHANNEL"},"hierarchy":{"id":-1},"level":{"id":1,"name":"CHNL_ID","label":"Channel"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":3,"name":"Indirect Offline","label":"Indirect Offline"}]}}}],"columnAddresses":[{"scope":{"dimension":{"id":6,"name":"TIME_DIM","label":"TIME"},"hierarchy":{"id":-1},"level":{"id":1,"name":"YEAR","label":"YEAR"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":224,"name":"2015","label":"2015"}]}}}]}}},"value":{"value":1.30571362575527E8},"format":{"format":"#,###","currency":"$"}}],[{"key":{"value":{"coordinates":{"rowAddresses":[{"scope":{"dimension":{"id":5,"name":"CHNL_DIM","label":"CHANNEL"},"hierarchy":{"id":-1},"level":{"id":1,"name":"CHNL_ID","label":"Channel"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":5,"name":"Indirect Online","label":"Indirect Online"}]}}}],"columnAddresses":[{"scope":{"dimension":{"id":6,"name":"TIME_DIM","label":"TIME"},"hierarchy":{"id":-1},"level":{"id":1,"name":"YEAR","label":"YEAR"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":224,"name":"2015","label":"2015"}]}}}]}}},"value":{"value":1648589.8529},"format":{"format":"#,###","currency":"$"}}]]',
	pivotSliceTransformed = '{"formatted":[{"0":"Channel","1":"2015"},{"0":"All Channels","1":146720475.54394126},{"0":"Direct Offline","1":0},{"0":"Direct Online","1":1962858.10564},{"0":"Indirect Offline","1":130571362.575527},{"0":"Indirect Online","1":1648589.8529}],"original":[[{"key":{"value":{"coordinates":{"rowAddresses":[{"scope":{"dimension":{"id":5,"name":"CHNL_DIM","label":"CHANNEL"},"hierarchy":{"id":-1},"level":{"id":1,"name":"CHNL_ID","label":"Channel"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":1,"name":"All Channels","label":"All Channels"}]}}}],"columnAddresses":[{"scope":{"dimension":{"id":6,"name":"TIME_DIM","label":"TIME"},"hierarchy":{"id":-1},"level":{"id":1,"name":"YEAR","label":"YEAR"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":224,"name":"2015","label":"2015"}]}}}]}}},"value":{"value":146720475.54394126},"format":{"format":"#,###","currency":"$"}}],[{"key":{"value":{"coordinates":{"rowAddresses":[{"scope":{"dimension":{"id":5,"name":"CHNL_DIM","label":"CHANNEL"},"hierarchy":{"id":-1},"level":{"id":1,"name":"CHNL_ID","label":"Channel"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":2,"name":"Direct Offline","label":"Direct Offline"}]}}}],"columnAddresses":[{"scope":{"dimension":{"id":6,"name":"TIME_DIM","label":"TIME"},"hierarchy":{"id":-1},"level":{"id":1,"name":"YEAR","label":"YEAR"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":224,"name":"2015","label":"2015"}]}}}]}}},"value":{"value":0},"format":{"format":"#,###","currency":"$"}}],[{"key":{"value":{"coordinates":{"rowAddresses":[{"scope":{"dimension":{"id":5,"name":"CHNL_DIM","label":"CHANNEL"},"hierarchy":{"id":-1},"level":{"id":1,"name":"CHNL_ID","label":"Channel"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":4,"name":"Direct Online","label":"Direct Online"}]}}}],"columnAddresses":[{"scope":{"dimension":{"id":6,"name":"TIME_DIM","label":"TIME"},"hierarchy":{"id":-1},"level":{"id":1,"name":"YEAR","label":"YEAR"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":224,"name":"2015","label":"2015"}]}}}]}}},"value":{"value":1962858.10564},"format":{"format":"#,###","currency":"$"}}],[{"key":{"value":{"coordinates":{"rowAddresses":[{"scope":{"dimension":{"id":5,"name":"CHNL_DIM","label":"CHANNEL"},"hierarchy":{"id":-1},"level":{"id":1,"name":"CHNL_ID","label":"Channel"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":3,"name":"Indirect Offline","label":"Indirect Offline"}]}}}],"columnAddresses":[{"scope":{"dimension":{"id":6,"name":"TIME_DIM","label":"TIME"},"hierarchy":{"id":-1},"level":{"id":1,"name":"YEAR","label":"YEAR"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":224,"name":"2015","label":"2015"}]}}}]}}},"value":{"value":130571362.575527},"format":{"format":"#,###","currency":"$"}}],[{"key":{"value":{"coordinates":{"rowAddresses":[{"scope":{"dimension":{"id":5,"name":"CHNL_DIM","label":"CHANNEL"},"hierarchy":{"id":-1},"level":{"id":1,"name":"CHNL_ID","label":"Channel"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":5,"name":"Indirect Online","label":"Indirect Online"}]}}}],"columnAddresses":[{"scope":{"dimension":{"id":6,"name":"TIME_DIM","label":"TIME"},"hierarchy":{"id":-1},"level":{"id":1,"name":"YEAR","label":"YEAR"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":224,"name":"2015","label":"2015"}]}}}]}}},"value":{"value":1648589.8529},"format":{"format":"#,###","currency":"$"}}]],"helperObject":[{},{"1":{"format":"#,###","currency":"$"}},{"1":{"format":"#,###","currency":"$"}},{"1":{"format":"#,###","currency":"$"}},{"1":{"format":"#,###","currency":"$"}},{"1":{"format":"#,###","currency":"$"}}]}',
	cellValue = '{"coordinates":{"rowAddresses":[{"scope":{"dimension":{"id":5,"name":"CHNL_DIM","label":"CHANNEL"},"hierarchy":{"id":-1},"level":{"id":1,"name":"CHNL_ID","label":"Channel"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":1,"name":"All Channels","label":"All Channels"}]}}}],"columnAddresses":[{"scope":{"dimension":{"id":6,"name":"TIME_DIM","label":"TIME"},"hierarchy":{"id":-1},"level":{"id":1,"name":"YEAR","label":"YEAR"}},"cellValue":{"specification":{"type":"Absolute","members":[{"id":224,"name":"2015","label":"2015"}]}}}]},"oldValue":1.4672047554394126E8,"newValue":1.4672047454394126E8}';
