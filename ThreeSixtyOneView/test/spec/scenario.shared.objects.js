"use strict";

var scenarioId = 10,
	cubeId = 3,
	cubeName = 'CMP Intent',
	elementId = 23,
	sampleView = {
		"id": 1,
		"name": "Default Marketing Plan view",
		"isDefault": true,
		"rows": [
		{
			"dimension": {
				"id": 1,
				"name": "VAR_DIM",
				"label": "VARIABLE"
			},
			"hierarchy": {
				"id": -1
			},
			"level": {
				"id": 3,
				"name": "ATTR2_ID",
				"label": "Brand/Nameplate"
			}
		},
		{
			"dimension": {
				"id": 2,
				"name": "PROD_DIM",
				"label": "PRODUCT"
			},
			"hierarchy": {
				"id": -1
			},
			"level": {
				"id": 1,
				"name": "PROD_ID",
				"label": "Nameplate"
			}
		}
		],
		"columns": [
		{
			"dimension": {
				"id": 1,
				"name": "VAR_DIM",
				"label": "VARIABLE"
			},
			"hierarchy": {
				"id": -1
			},
			"level": {
				"id": 2,
				"name": "ATTR1_ID",
				"label": "National/Local"
			}
		},
		{
			"dimension": {
				"id": 3,
				"name": "GEO_DIM",
				"label": "GEO"
			},
			"hierarchy": {
				"id": -1
			},
			"level": {
				"id": 2,
				"name": "ATTR1_ID",
				"label": "Region"
			}
		}
		],
		"filters": [
		{
			"id": 122,
			"scope": {
				"dimension": {
					"id": 1,
					"name": "VAR_DIM",
					"label": "VARIABLE"
				},
				"hierarchy": {
					"id": 1,
					"name": "National/Local",
					"label": "National/Local"
				},
				"level": {
					"id": 2,
					"name": "ATTR1_ID",
					"label": "National/Local"
				}
			},
			"value": {
				"specification": {
					"type": "All"
				}
			}
		},
		{
			"id": 123,
			"scope": {
				"dimension": {
					"id": 2,
					"name": "PROD_DIM",
					"label": "PRODUCT"
				},
				"hierarchy": {
					"id": 16,
					"name": "Nameplate Category",
					"label": "Nameplate Category"
				},
				"level": {
					"id": 2,
					"name": "ATTR1_ID",
					"label": "Nameplate Category"
				}
			},
			"value": {
				"specification": {
					"type": "All"
				}
			}
		},
		{
			"id": 124,
			"scope": {
				"dimension": {
					"id": 3,
					"name": "GEO_DIM",
					"label": "GEO"
				},
				"hierarchy": {
					"id": 17,
					"name": "Region",
					"label": "Region"
				},
				"level": {
					"id": 2,
					"name": "ATTR1_ID",
					"label": "Region"
				}
			},
			"value": {
				"specification": {
					"type": "All"
				}
			}
		},
		{
			"id": 125,
			"scope": {
				"dimension": {
					"id": 4,
					"name": "TIME_DIM",
					"label": "TIME"
				},
				"hierarchy": {
					"id": 18,
					"name": "YEAR",
					"label": "YEAR"
				},
				"level": {
					"id": 1,
					"name": "YEAR",
					"label": "YEAR"
				}
			},
			"value": {
				"specification": {
					"type": "Absolute",
					"members": [
					{
						"id": 103,
						"name": "2015",
						"label": "2015"
					}
					]
				}
			}
		}
		]
	},
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
	];