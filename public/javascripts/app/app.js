$(function(){
	Backbone.pubSub = _.extend({}, Backbone.Events);
	loadGoogleApi();
	if(localStorage.token) new app.router.AppRouter();
    else new app.router.LoginRouter();

    window.settings = {
        channels: [
            [{from:470,to:476,tooltipText:'14',color:'rgba(68, 170, 213, 0.2)'}, {from:476,to:482,tooltipText:'15',color:'rgba(0, 0, 0, 0)'}, {from:482,to:488,tooltipText:'16',color:'rgba(68, 170, 213, 0.2)'}, {from:488,to:494,tooltipText:'17',color:'rgba(0, 0, 0, 0)'}, {from:494,to:500,tooltipText:'18',color:'rgba(68, 170, 213, 0.2)'}, {from:500,to:506,tooltipText:'19',color:'rgba(0, 0, 0, 0)'}, {from:506,to:512,tooltipText:'20',color:'rgba(68, 170, 213, 0.2)'}, {from:512,to:518,tooltipText:'21',color:'rgba(0, 0, 0, 0)'}, {from:518,to:524,tooltipText:'22',color:'rgba(68, 170, 213, 0.2)'}, {from:524,to:530,tooltipText:'23',color:'rgba(0, 0, 0, 0)'}, {from:530,to:536,tooltipText:'24',color:'rgba(68, 170, 213, 0.2)'}, {from:536,to:542,tooltipText:'25',color:'rgba(0, 0, 0, 0)'}, {from:542,to:548,tooltipText:'26',color:'rgba(68, 170, 213, 0.2)'}, {from:548,to:554,tooltipText:'27',color:'rgba(0, 0, 0, 0)'}, {from:554,to:560,tooltipText:'28',color:'rgba(68, 170, 213, 0.2)'}, {from:560,to:566,tooltipText:'29',color:'rgba(0, 0, 0, 0)'}, {from:566,to:572,tooltipText:'30',color:'rgba(68, 170, 213, 0.2)'}, {from:572,to:578,tooltipText:'31',color:'rgba(0, 0, 0, 0)'}, {from:578,to:584,tooltipText:'32',color:'rgba(68, 170, 213, 0.2)'}, {from:584,to:590,tooltipText:'33',color:'rgba(0, 0, 0, 0)'}, {from:590,to:596,tooltipText:'34',color:'rgba(68, 170, 213, 0.2)'}, {from:596,to:602,tooltipText:'35',color:'rgba(0, 0, 0, 0)'}, {from:602,to:608,tooltipText:'36',color:'rgba(68, 170, 213, 0.2)'}, {from:608,to:614,tooltipText:'37',color:'rgba(0, 0, 0, 0)'}, {from:614,to:620,tooltipText:'38',color:'rgba(68, 170, 213, 0.2)'}, {from:620,to:626,tooltipText:'39',color:'rgba(0, 0, 0, 0)'}, {from:626,to:632,tooltipText:'40',color:'rgba(68, 170, 213, 0.2)'}, {from:632,to:638,tooltipText:'41',color:'rgba(0, 0, 0, 0)'}, {from:638,to:644,tooltipText:'42',color:'rgba(68, 170, 213, 0.2)'}, {from:644,to:650,tooltipText:'43',color:'rgba(0, 0, 0, 0)'}, {from:650,to:656,tooltipText:'44',color:'rgba(68, 170, 213, 0.2)'}, {from:656,to:662,tooltipText:'45',color:'rgba(0, 0, 0, 0)'}, {from:662,to:668,tooltipText:'46',color:'rgba(68, 170, 213, 0.2)'}, {from:668,to:674,tooltipText:'47',color:'rgba(0, 0, 0, 0)'}, {from:674,to:680,tooltipText:'48',color:'rgba(68, 170, 213, 0.2)'}, {from:680,to:686,tooltipText:'49',color:'rgba(0, 0, 0, 0)'}, {from:686,to:692,tooltipText:'50',color:'rgba(68, 170, 213, 0.2)'}, {from:692,to:698,tooltipText:'51',color:'rgba(0, 0, 0, 0)'}, {from:698,to:704,tooltipText:'52',color:'rgba(68, 170, 213, 0.2)'}, {from:704,to:710,tooltipText:'53',color:'rgba(0, 0, 0, 0)'}, {from:710,to:716,tooltipText:'54',color:'rgba(68, 170, 213, 0.2)'}, {from:716,to:722,tooltipText:'55',color:'rgba(0, 0, 0, 0)'}, {from:722,to:728,tooltipText:'56',color:'rgba(68, 170, 213, 0.2)'}, {from:728,to:734,tooltipText:'57',color:'rgba(0, 0, 0, 0)'}, {from:734,to:740,tooltipText:'58',color:'rgba(68, 170, 213, 0.2)'}, {from:740,to:746,tooltipText:'59',color:'rgba(0, 0, 0, 0)'}, {from:746,to:752,tooltipText:'60',color:'rgba(68, 170, 213, 0.2)'}, {from:752,to:758,tooltipText:'61',color:'rgba(0, 0, 0, 0)'}, {from:758,to:764,tooltipText:'62',color:'rgba(68, 170, 213, 0.2)'}, {from:764,to:770,tooltipText:'63',color:'rgba(0, 0, 0, 0)'}, {from:770,to:776,tooltipText:'64',color:'rgba(68, 170, 213, 0.2)'}, {from:776,to:782,tooltipText:'65',color:'rgba(0, 0, 0, 0)'}, {from:782,to:788,tooltipText:'66',color:'rgba(68, 170, 213, 0.2)'}, {from:788,to:794,tooltipText:'67',color:'rgba(0, 0, 0, 0)'}, {from:794,to:800,tooltipText:'68',color:'rgba(68, 170, 213, 0.2)'}, {from:800,to:806,tooltipText:'69',color:'rgba(0, 0, 0, 0)'}, {from:806,to:812,tooltipText:'70',color:'rgba(68, 170, 213, 0.2)'}, {from:812,to:818,tooltipText:'71',color:'rgba(0, 0, 0, 0)'}, {from:818,to:824,tooltipText:'72',color:'rgba(68, 170, 213, 0.2)'}, {from:824,to:830,tooltipText:'73',color:'rgba(0, 0, 0, 0)'}, {from:830,to:836,tooltipText:'74',color:'rgba(68, 170, 213, 0.2)'}, {from:836,to:842,tooltipText:'75',color:'rgba(0, 0, 0, 0)'}, {from:842,to:848,tooltipText:'76',color:'rgba(68, 170, 213, 0.2)'}, {from:848,to:854,tooltipText:'77',color:'rgba(0, 0, 0, 0)'}, {from:854,to:860,tooltipText:'78',color:'rgba(68, 170, 213, 0.2)'}, {from:860,to:866,tooltipText:'79',color:'rgba(0, 0, 0, 0)'}, {from:866,to:872,tooltipText:'80',color:'rgba(68, 170, 213, 0.2)'}, {from:872,to:878,tooltipText:'81',color:'rgba(0, 0, 0, 0)'}, {from:878,to:884,tooltipText:'82',color:'rgba(68, 170, 213, 0.2)'}, {from:884,to:890,tooltipText:'83',color:'rgba(0, 0, 0, 0)'},

                {
                    from: 2401, 
                    to: 2423, 
                    tooltipText:'1',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(250, 185, 167, 0.4)'
                }, {
                    from:2406,
                    to:2428,
                    tooltipText:'2',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(254, 212, 182, 0.4)'
                }, {
                    from: 2411, 
                    to: 2433, 
                    tooltipText:'3',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(247, 237, 190, 0.4)'
                }, {
                    from:2416,
                    to:2438,
                    tooltipText:'4',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(240, 246, 194, 0.4)'
                }, {
                    from: 2421, 
                    to: 2443, 
                    tooltipText:'5',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(212, 234, 187, 0.4)'
                }, {
                    from:2426,
                    to:2448,
                    tooltipText:'6',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(200, 231, 188, 0.4)'
                }, {
                    from: 2431, 
                    to: 2453, 
                    tooltipText:'7',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(198, 239, 197, 0.4)'
                }, {
                    from:2436,
                    to:2458,
                    tooltipText:'8',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(188, 228, 200, 0.4)'
                }, {
                    from: 2441, 
                    to: 2463, 
                    tooltipText:'9',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(195, 236, 205, 0.4)'
                }, {
                    from:2446,
                    to:2468,
                    tooltipText:'10',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(190, 225, 250, 0.4)'
                }, {
                    from: 2451, 
                    to: 2473, 
                    tooltipText:'11',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(177, 181, 219, 0.4)'
                }, {
                    from:2456,
                    to:2478,
                    tooltipText:'12',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(193, 193, 234, 0.4)'
                }, {
                    from: 2461, 
                    to: 2483, 
                    tooltipText:'13',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(196, 185, 221, 0.4)'
                }, {
                    from:2473,
                    to:2495,
                    tooltipText:'14',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(221, 178, 214, 0.4)'
                }




            ],
            [{from:470,to:478,tooltipText:'21',color:'rgba(237,215,213,0.2)'}, {from:478,to:486,tooltipText:'22',color:'rgba(0, 0, 0, 0)'}, {from:486,to:494,tooltipText:'23',color:'rgba(237,215,213,0.2)'}, {from:494,to:502,tooltipText:'24',color:'rgba(0, 0, 0, 0)'}, {from:502,to:510,tooltipText:'25',color:'rgba(237,215,213,0.2)'}, {from:510,to:518,tooltipText:'26',color:'rgba(0, 0, 0, 0)'}, {from:518,to:526,tooltipText:'27',color:'rgba(237,215,213,0.2)'}, {from:526,to:534,tooltipText:'28',color:'rgba(0, 0, 0, 0)'}, {from:534,to:542,tooltipText:'29',color:'rgba(237,215,213,0.2)'}, {from:542,to:550,tooltipText:'30',color:'rgba(0, 0, 0, 0)'}, {from:550,to:558,tooltipText:'31',color:'rgba(237,215,213,0.2)'}, {from:558,to:566,tooltipText:'32',color:'rgba(0, 0, 0, 0)'}, {from:566,to:574,tooltipText:'33',color:'rgba(237,215,213,0.2)'}, {from:574,to:582,tooltipText:'34',color:'rgba(0, 0, 0, 0)'}, {from:582,to:590,tooltipText:'35',color:'rgba(237,215,213,0.2)'}, {from:590,to:598,tooltipText:'36',color:'rgba(0, 0, 0, 0)'}, {from:598,to:606,tooltipText:'37',color:'rgba(237,215,213,0.2)'}, {from:606,to:614,tooltipText:'38',color:'rgba(0, 0, 0, 0)'}, {from:614,to:622,tooltipText:'39',color:'rgba(237,215,213,0.2)'}, {from:622,to:630,tooltipText:'40',color:'rgba(0, 0, 0, 0)'}, {from:630,to:638,tooltipText:'41',color:'rgba(237,215,213,0.2)'}, {from:638,to:646,tooltipText:'42',color:'rgba(0, 0, 0, 0)'}, {from:646,to:654,tooltipText:'43',color:'rgba(237,215,213,0.2)'}, {from:654,to:662,tooltipText:'44',color:'rgba(0, 0, 0, 0)'}, {from:662,to:670,tooltipText:'45',color:'rgba(237,215,213,0.2)'}, {from:670,to:678,tooltipText:'46',color:'rgba(0, 0, 0, 0)'}, {from:678,to:686,tooltipText:'47',color:'rgba(237,215,213,0.2)'}, {from:686,to:694,tooltipText:'48',color:'rgba(0, 0, 0, 0)'}, {from:694,to:702,tooltipText:'49',color:'rgba(237,215,213,0.2)'}, {from:702,to:710,tooltipText:'50',color:'rgba(0, 0, 0, 0)'}, {from:710,to:718,tooltipText:'51',color:'rgba(237,215,213,0.2)'}, {from:718,to:726,tooltipText:'52',color:'rgba(0, 0, 0, 0)'}, {from:726,to:734,tooltipText:'53',color:'rgba(237,215,213,0.2)'}, {from:734,to:742,tooltipText:'54',color:'rgba(0, 0, 0, 0)'}, {from:742,to:750,tooltipText:'55',color:'rgba(237,215,213,0.2)'}, {from:750,to:758,tooltipText:'56',color:'rgba(0, 0, 0, 0)'}, {from:758,to:766,tooltipText:'57',color:'rgba(237,215,213,0.2)'}, {from:766,to:774,tooltipText:'58',color:'rgba(0, 0, 0, 0)'}, {from:774,to:782,tooltipText:'59',color:'rgba(237,215,213,0.2)'}, {from:782,to:790,tooltipText:'60',color:'rgba(0, 0, 0, 0)'}, {from:790,to:798,tooltipText:'61',color:'rgba(237,215,213,0.2)'}, {from:798,to:806,tooltipText:'62',color:'rgba(0, 0, 0, 0)'}, {from:806,to:814,tooltipText:'63',color:'rgba(237,215,213,0.2)'}, {from:814,to:822,tooltipText:'64',color:'rgba(0, 0, 0, 0)'}, {from:822,to:830,tooltipText:'65',color:'rgba(237,215,213,0.2)'}, {from:830,to:838,tooltipText:'66',color:'rgba(0, 0, 0, 0)'}, {from:838,to:846,tooltipText:'67',color:'rgba(237,215,213,0.2)'}, {from:846,to:854,tooltipText:'68',color:'rgba(0, 0, 0, 0)'}, {from:854,to:862,tooltipText:'69',color:'rgba(237,215,213,0.2)'},

                                {
                    from: 2401, 
                    to: 2423, 
                    tooltipText:'1',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(250, 185, 167, 0.4)'
                }, {
                    from:2406,
                    to:2428,
                    tooltipText:'2',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(254, 212, 182, 0.4)'
                }, {
                    from: 2411, 
                    to: 2433, 
                    tooltipText:'3',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(247, 237, 190, 0.4)'
                }, {
                    from:2416,
                    to:2438,
                    tooltipText:'4',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(240, 246, 194, 0.4)'
                }, {
                    from: 2421, 
                    to: 2443, 
                    tooltipText:'5',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(212, 234, 187, 0.4)'
                }, {
                    from:2426,
                    to:2448,
                    tooltipText:'6',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(200, 231, 188, 0.4)'
                }, {
                    from: 2431, 
                    to: 2453, 
                    tooltipText:'7',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(198, 239, 197, 0.4)'
                }, {
                    from:2436,
                    to:2458,
                    tooltipText:'8',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(188, 228, 200, 0.4)'
                }, {
                    from: 2441, 
                    to: 2463, 
                    tooltipText:'9',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(195, 236, 205, 0.4)'
                }, {
                    from:2446,
                    to:2468,
                    tooltipText:'10',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(190, 225, 250, 0.4)'
                }, {
                    from: 2451, 
                    to: 2473, 
                    tooltipText:'11',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(177, 181, 219, 0.4)'
                }, {
                    from:2456,
                    to:2478,
                    tooltipText:'12',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(193, 193, 234, 0.4)'
                }, {
                    from: 2461, 
                    to: 2483, 
                    tooltipText:'13',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(196, 185, 221, 0.4)'
                }, {
                    from:2473,
                    to:2495,
                    tooltipText:'14',
                    color:'rgba(0, 0, 0, 0)',
                    colorSelected:'RGBA(221, 178, 214, 0.4)'
                }

            ]
        ],

        fixedChannels: [],
        googleMapApi: false,
        markers: {
            iconIdle: '../../images/icon_unselected_transparent.png',
            iconHover: '../../images/icon_selected.png',
            iconNormal: '../../images/icon_unselected_normal.png'
        }
    };

	Backbone.history.start();
});

function loadGoogleApi() {
    var l = new app.util.Loader();
    l.require(['http://www.google.com/jsapi'], function(){
        google.load("maps", "3", { 
            other_params:'libraries=visualization', 
            callback: loadGoogleMapHeatmapPlugin 
        });

        google.load("visualization", "1", {
            callback: loadGoogleVisualizationPlugin 
        });
    });
}

function loadGoogleMapHeatmapPlugin(){
    window.settings.googleMapApi = true;
    Backbone.pubSub.trigger('Google:MapAPILoaded');
}

function loadGoogleVisualizationPlugin(){
    window.settings.googleVisualizationApi = true;
    Backbone.pubSub.trigger('event-loaded-google-visualization-api');
}