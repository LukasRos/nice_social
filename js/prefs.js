function doShowPrefs(pref) {
    if ( pref === '' || pref === undefined ) {
        toggleClass('prefs','show','hide');
    } else {
        toggleClassIfExists('prefs','hide','show');
        if ( constructDialog('prefs') ) { fillPrefsWindow(pref); }
    }
}
function fillPrefsWindow( opt ) {
    var bgColor = '#' + readStorage('header_background'),
        frColor = '#' + readStorage('header_color');
    var html = '';

    switch ( opt ) {
        case 'main':
            var items = { 'streams': { 'label': "Streams", 'icon': "fa-bullhorn", 'action': "fillPrefsWindow('streams');" },
                          'prefs': { 'label': "Preferences", 'icon': "fa-sliders", 'action': "fillPrefsWindow('prefs');" },
                          'accts': { 'label': "Accounts", 'icon': "fa-users", 'action': "fillAcctsWindows();"},
                          'logout': { 'label': "Log Out", 'icon': "fa-sign-out", 'action': "doLogout();" }
                        };
            for ( item in items ) {
                html += '<button class="btn btn-prefs" style="background-color: ' + bgColor + '; color: ' + frColor + '"' +
                               ' onClick="' + items[item].action + '">' +
                            '<i class="fa ' + items[item].icon + '"></i>' +
                            '<span>' + items[item].label + '</span>' +
                        '</button>';
            }
            break;

        case 'color':
            var items = { 'Interface Colours': { 'body_background': "Background Colour",
                                                 'header_background': "Header Background",
                                                 'header_color': "Header Colour" },
                          'Post Colours': { 'post-name_color': "Account Name Text",
                                            'post-content_color': "Post Content Text",
                                            'post-mention_color': "Post Mentions Text",
                                            'post-highlight_color': "Post Hightlight Colour" },
                          'Avatar Colours': { 'one-day_color': "Brand New Ring",
                                              'one-week_color': "New Account Ring",
                                              'mention_color': "Mentions Ring",
                                              'avatar_color': "Regular Ring" }
                         };
            var presets = getCSSPresets();
            html = '<strong class="lbltxt" style="width: 95%; text-align: justify; padding: 0 2.5%;">Choose a Colour Scheme You Like:</strong>' +
                   '<label class="lbltxt" for="preset">Presets:</label>' +
                   '<select id="preset" onChange="loadCSSPreset(this.value);">';
            for ( idx in presets ) {
                html += '<option value="' + idx + '">' + presets[idx].label + '</option>';
            }
            html +='</select>';

            for ( item in items ) {
                html += '<strong class="lbltxt" style="width: 95%; text-align: justify; padding: 0 2.5%;">' + item + '</strong>';
                for ( itm in items[item] ) {
                    html += '<label class="lbltxt" for="' + itm + '">' + items[item][itm] + ':</label>' +
                            '<input type="text" id="' + itm + '" value="' + readStorage( itm ) + '"' +
                                  ' onkeyup="validateHexColorAndPreview(\'' + itm + '\');"' +
                                  ' onchange="validateHexColorAndPreview(\'' + itm + '\');">' +
                            '<ex id="prev' + itm + '" style="background-color: #' + readStorage( itm ) + '">&nbsp;</ex>';

                }
            }
            html += '<button style="float: right;" class="btn-green" onClick="saveCSSPreferences();">Set</button>' +
                    '<button style="background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'prefs\');"><i class="fa fa-reply"></i> Back</button>';
            break;

        case 'display':
            loadMomentIfRequired( true );
            var spacer = '';
            var items = { 0: { 'label': "Timestamps",
                               'notes': "Customise How You See Post Times",
                               'icon' : "fa-clock-o",
                               'items': { 'absolute_times': { 'label': "Timestamps", 'type': "ar", 'js': "setTimestamps();" },
                                          /* 'keep_timezone': { 'label': "Keep Timezone", 'type': "yn", 'js':"" }, */
                                          'show_24h_timestamps': { 'label': "24h Timestamps", 'type': "yn", 'js': "setTimestamps();" },
                                          'show_live_timestamps': { 'label': "Live Timestamps", 'type': "yn", 'js': "setTimestamps();" }
                                         }
                              },
                          1: { 'label': "Post Preferences",
                               'notes': "Customise How Posts are Drawn",
                               'icon' : "fa-columns",
                               'items': { 'hide_audio':   { 'label': "Hide Audio Files", 'type': "yn", 'js': "togglePostElement(\'hide_audio\');" },
                                          'hide_avatars':   { 'label': "Hide Avatars", 'type': "yn", 'js': "togglePostElement(\'hide_avatars\');" },
                                          'hide_images':  { 'label': "Hide Images", 'type': "yn", 'js': "togglePostElement(\'hide_images\');" },
                                          'hide_geodata': { 'label': "Hide GeoMaps", 'type': "yn", 'js': "togglePostElement(\'hide_geodata\');" },
                                          'hide_longpost': { 'label': "Tiny Long Posts", 'type': "yn", 'js': "" }
                                         }
                              },
                          2: { 'label': "Account Profile",
                               'notes': "Display and Hide Profile Information",
                               'icon' : "fa-street-view",
                               'items': { 'display_nrscore': { 'label': "Show NR Score", 'type': "yn", 'js':"" },
                                          'display_usage': { 'label': "Show Usage Graph", 'type': "yn", 'js':"" }
                                          /* 'display_details': { 'label': "Show Account Details", 'type': "yn", 'js':"" },
                                          'display_oneavatar': { 'label': "Prevent Avatar Changes", 'type': "yn", 'js':"" } */
                                         }
                              }
                         };
            for ( idx in items ) {
                html += spacer +
                        '<strong class="lbltxt" style="width: 95%; text-align: justify; padding: 0 2.5%;">' +
                            '<i class="fa ' + items[idx].icon + '"></i> ' + items[idx].label +
                        '</strong>';
                if ( items[idx].notes !== '' ) {
                    html += '<em class="lbltxt" style="display: block; width: 95%; text-align: justify; padding: 0 2.5%;">' + items[idx].notes + '</em>';
                }
                for ( i in items[idx].items ) {
                    html += '<label class="lbltxt">' + items[idx].items[i].label + '</label>' +
                            getButtonValue( 'btn-opt-' + i,
                                            i,
                                            items[idx].items[i].type,
                                            'toggleOption(\'' + i + '\', \'' + items[idx].items[i].type + '\');' +
                                            ( ( items[idx].items[i].js == "" ) ? '' : ' ' + items[idx].items[i].js)
                                           );
                }
                spacer = '<br><br>';
            }
            html += '<button style="display: block; background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'prefs\');"><i class="fa fa-reply"></i> Back</button>';
            break;

        case 'font':
            var items = { '10': { 'label': "Tiny", 'icon': "fa-font" },
                          '12': { 'label': "Small", 'icon': "fa-font" },
                          '14': { 'label': "Normal", 'icon': "fa-font" },
                          '16': { 'label': "Larger", 'icon': "fa-font" },
                          '18': { 'label': "Bigger", 'icon': "fa-font" },
                          '20': { 'label': "HUGE!", 'icon': "fa-font" }
                        };
            var families = ['Helvetica', 'Arial', 'Comic Sans MS', 'Courier New', 'Geneva', 'Georgia', 'Monospace',
                            'Palatino Linotype', 'Sans Serif', 'Serif', 'Tahoma', 'Times New Roman', 'Verdana'];
            var size_px = readStorage('font_size');
            var ff = readStorage('font_family');
            html = '<strong class="lbltxt" style="width: 95%; text-align: justify; padding: 0 2.5%;">Choose Your Text Preferences.</strong>' +
                   '<label class="lbltxt" for="preset">Font Family:</label>' +
                   '<select id="preset" onChange="setFontFamily(this.value);">';
            for ( idx in families ) {
                var selText = ( families[idx] === ff ) ? ' selected' : '';
                html += '<option value="' + families[idx] + '" style="font-family: ' + families[idx] + ';"' + selText + '>' + families[idx] + '</option>';
            }
            html += '</select>';
            for ( item in items ) {
                if ( item === size_px ) {
                    var bg = '#' + readStorage('header_color'),
                        fr = '#' + readStorage('header_background');
                } else {
                    var bg = '#' + readStorage('header_background'),
                        fr = '#' + readStorage('header_color');
                }
                html += '<button id="btn-pt-' + item + '" class="btn btn-prefs" style="background-color: ' + bg + '; color: ' + fr + '"' +
                               ' onClick="setFontSize(' + item + ')">' +
                            '<i class="fa ' + items[item].icon + '" style="font-size: ' + item + 'px;"></i>' +
                            '<span>' + items[item].label + '</span>' +
                        '</button>';
            }
            html += '<button style="background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'prefs\');"><i class="fa fa-reply"></i> Back</button>';
            break;

        case 'hover':
            var items = { 'label': "Mouse Hover Options",
                          'notes': "You can have the Interaction buttons appear when your mouse hovers over a post if you&apos;d like.",
                          'items': { 'show_hover': { 'label': "Show Interactions", 'style': 'bool', 'type': "ed" },
                                     'show_hover_delay': { 'label': "Hide After (Seconds)", 'style': 'seconds', 'type': '' }
                                    }
                              };
            html += '<strong class="lbltxt" style="width: 95%; text-align: justify; padding: 0 2.5%;">' +
                        '<i class="fa fa-location-arrow"></i> ' + items.label +
                    '</strong>';
            if ( items.notes !== '' ) {
                html += '<em class="lbltxt" style="display: block; width: 95%; text-align: justify; padding: 0 2.5%;">' +
                            items.notes +
                        '</em>';
            }
            for ( i in items.items ) {
                var fr = bgColor,
                    bg = frColor,
                    tx = '<i class="fa fa-circle"></i> Enabled';
                switch ( items.items[i].style ) {
                    case 'bool':
                        var value = readStorage( i );
                        if ( value === 'N' ) {
                            fr = frColor;
                            bg = bgColor;
                            tx = '<i class="fa fa-circle-o"></i> Disabled'
                        }
                        html += '<label class="lbltxt">' + items.items[i].label + '</label>' +
                                '<button id="btn-opt-' + i + '" class="btn" style="background-color: ' + bg + '; color: ' + fr + '"' +
                                       ' onClick="toggleOption(\'' + i + '\', \'' + items.items[i].type + '\');">' + tx + '</button>';
                        break;

                    case 'seconds':
                        var value = readStorage( i );
                        value = parseInt(value) / 1000;
                        if ( value === undefined || isNaN(value) ) { value = 5; }
                        html += '<label class="lbltxt">' + items.items[i].label + '</label>' +
                                '<input type="text" id="' + i + '" value="' + value + '">';
                        break;

                    default:
                        /* Do Nothing */
                }
            }
            html += '<button style="float: right;" class="btn-green" onClick="setDelaySeconds();">Set</button>' +
                    '<button style="display: block; background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'prefs\');"><i class="fa fa-reply"></i> Back</button>';
            break;

        case 'language':
            var items = { 'en': { 'label': "English", 'icon': "fa-comments-o" },
                          'de': { 'label': "Deutsch", 'icon': "fa-comments-o" },
                          'es': { 'label': "Español", 'icon': "fa-comments-o" },
                          'fr': { 'label': "Français", 'icon': "fa-comments-o" },
                          'it': { 'label': "Italiano", 'icon': "fa-comments-o" },
                          'pr': { 'label': "Português", 'icon': "fa-comments-o" },
                          'ru': { 'label': "русский", 'icon': "fa-comments-o" },
                          'sv': { 'label': "svenska", 'icon': "fa-comments-o" },
                          'ja': { 'label': "日本語", 'icon': "fa-comments-o" },
                          'ko': { 'label': "한국어", 'icon': "fa-comments-o" }
                        };
            html += '<strong style="width: 95%; text-align: justify; padding: 0 2.5%;">Choose a Display Language:</strong>';
            for ( item in items ) {
                if ( item === 'en' ) {
                    var bg = '#' + readStorage('header_color'),
                        fr = '#' + readStorage('header_background');
                } else {
                    var bg = '#' + readStorage('header_background'),
                        fr = '#' + readStorage('header_color');
                }
                html += '<button id="btn-tl-' + item + '" class="btn btn-prefs" style="background-color: ' + bg + '; color: ' + fr + '"' +
                               ' onClick="toggleLanguage(\'' + item + '\')">' +
                            '<i class="fa ' + items[item].icon + '"></i>' +
                            '<span>' + items[item].label + '</span>' +
                        '</button>';
            }
            html += '<button style="background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'prefs\');"><i class="fa fa-reply"></i> Back</button>';
            break;
        
        case 'mutes':
            var clients = readMutedClients();
            var hashes = readMutedHashtags();
            html += '<strong class="lbltxt" style="display: block; width: 95%; text-align: justify; padding: 0 2.5%;">Muted Hashtags:</strong>';
            for ( idx in hashes ) {
                html += '<button name="hashes" class="btn btn-half" style="background-color: ' + frColor + '; color: ' + bgColor + '"' +
                               ' value="' + hashes[idx] + '" onClick="removeHashFilter(\'' + hashes[idx] + '\');">' +
                            hashes[idx] + ' <i class="fa fa-times"></i>' +
                        '</button>';
            }
            if ( hashes.length === 0 ) {
                html += '<em class="lbltxt" style="display: block; width: 90%; text-align: center; padding: 15px 5%;">' +
                            'You Have Not Muted Any Hashtags' +
                        '</em>';
            }
            html += '<strong class="lbltxt" style="display: block; margin-top: 15px; width: 95%; text-align: justify; padding: 0 2.5%;">Muted Clients:</strong>';
            for ( idx in clients ) {
                html += '<button name="hashes" class="btn btn-half" style="background-color: ' + frColor + '; color: ' + bgColor + '"' +
                               ' onClick="removeHashFilter(\'' + clients[idx] + '\');">' +
                            clients[idx] + ' <i class="fa fa-times"></i>' +
                        '</button>';
            }
            if ( clients.length === 0 ) {
                html += '<em class="lbltxt" style="display: block; width: 90%; text-align: center; padding: 15px 5%;">' +
                            'You Have Not Muted Any Clients' +
                        '</em>';
            }
            html += '<button style="display: block; background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'prefs\');"><i class="fa fa-reply"></i> Back</button>';
            break;

        case 'global':
            var spacer = '';
            var items = { 0: { 'label': "Basic Global Timeline Filters",
                               'notes': "Customise How You See the Global Timeline",
                               'items': { 'nicerank': { 'label': "NiceRank", 'type': "ed" },
                                          'feeds_hide': { 'label': "Feed Accounts", 'type': "vh" },
                                          'global_hide': { 'label': "Accounts I Follow", 'type': "vh" },
                                         }
                              }
                         };
            for ( idx in items ) {
                html += spacer +
                        '<strong class="lbltxt" style="width: 95%; text-align: justify; padding: 0 2.5%;">' +
                            '<i class="fa fa-filter"></i> ' + items[idx].label +
                        '</strong>';
                if ( items[idx].notes !== '' ) {
                    html += '<em class="lbltxt" style="display: block; width: 95%; text-align: justify; padding: 0 2.5%;">' + items[idx].notes + '</em>';
                }
                for ( i in items[idx].items ) {
                    html += '<label class="lbltxt">' + items[idx].items[i].label + '</label>' +
                            getButtonValue( 'btn-opt-' + i,
                                            i,
                                            items[idx].items[i].type,
                                            'toggleOption(\'' + i + '\', \'' + items[idx].items[i].type + '\');'
                                           );
                }
                spacer = '<br><br>';
            }

            html += '<button style="display: block; background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'prefs\');"><i class="fa fa-reply"></i> Back</button>';
            break;
        
        case 'keyboard':
            var spacer = '';
            var items = { 0: { 'label': "Keyboard Shortcuts",
                               'notes': "Choose the Keyboard Shortcuts You Use",
                               'icon' : "fa-keyboard-o",
                               'items': { 'shortkey_n': { 'label': "New Post (N)", 'type': "yn", 'js':"" },
                                          'shortkey_cmdk': { 'label': "Clear Posts (Ctrl+K / ⌘+K)", 'type': "yn", 'js':"" },
                                          'shortkey_f3': { 'label': "Preferences (F3)", 'type': "yn", 'js':"" },
                                          'shortkey_down': { 'label': "Auto-Complete (▼)", 'type': "yn", 'js':"" },
                                          'shortkey_esc': { 'label': "Escape (Esc)", 'type': "yn", 'js':"" },
                                         }
                              }
                         };
            for ( idx in items ) {
                html += spacer +
                        '<strong class="lbltxt" style="width: 95%; text-align: justify; padding: 0 2.5%;">' +
                            '<i class="fa ' + items[idx].icon + '"></i> ' + items[idx].label +
                        '</strong>';
                if ( items[idx].notes !== '' ) {
                    html += '<em class="lbltxt" style="display: block; width: 95%; text-align: justify; padding: 0 2.5%;">' + items[idx].notes + '</em>';
                }
                for ( i in items[idx].items ) {
                    html += '<label class="lbltxt">' + items[idx].items[i].label + '</label>' +
                            getButtonValue( 'btn-opt-' + i,
                                            i,
                                            items[idx].items[i].type,
                                            'toggleOption(\'' + i + '\', \'' + items[idx].items[i].type + '\');' +
                                            ( ( items[idx].items[i].js == "" ) ? '' : ' ' + items[idx].items[i].js)
                                           );
                }
                spacer = '<br><br>';
            }
            html += '<button style="display: block; background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'prefs\');"><i class="fa fa-reply"></i> Back</button>';
            break;

        case 'ppcolumn':
            var items = { '50': { 'label': "Posts", 'icon': "50" },
                          '100': { 'label': "Posts", 'icon': "100" },
                          '250': { 'label': "Posts", 'icon': "250" },
                          '500': { 'label': "Posts", 'icon': "500" },
                          '1000': { 'label': "Posts", 'icon': "1000" },
                          '99999': { 'label': "Posts", 'icon': "&infin;" },
                        };
            var ppc = readStorage('column_max');
            html += '<strong class="lbltxt" style="width: 95%; text-align: justify; padding: 0 2.5%;">' +
                        'What&apos;s The Maximum Number of Posts You Want in Each Column?' +
                    '</strong>';
            for ( item in items ) {
                var bg = '#' + readStorage('header_background'),
                    fr = '#' + readStorage('header_color');

                if ( item === ppc ) {
                    bg = '#' + readStorage('header_color');
                    fr = '#' + readStorage('header_background');
                }
                html += '<button id="btn-ppc-' + item + '" class="btn btn-prefs" style="background-color: ' + bg + '; color: ' + fr + '"' +
                               ' onClick="setPostsPerColumn(' + item + ')">' +
                            '<i>' + items[item].icon + '</i>' +
                            '<span>' + items[item].label + '</span>' +
                        '</button>';
            }
            html += '<button style="display: block; background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'prefs\');"><i class="fa fa-reply"></i> Back</button>';
            break;

        case 'prefs':
            var items = { 'color': { 'label': "Colours", 'icon': "fa-paint-brush" },
                          'ppcolumn': { 'label': "Column Length", 'icon': "fa-columns" },
                          'display': { 'label': "Display Prefs", 'icon': "fa-cloud" },
                          'font': { 'label': "Fonts", 'icon': "fa-font" },
                          'hover': { 'label': "Hovers", 'icon': "fa-location-arrow" },
                          'global': { 'label': "Filtering", 'icon': "fa-globe" },
                          'keyboard': { 'label': "Keyboard Shortcuts", 'icon': "fa-keyboard-o" },
                          'mutes': { 'label': "Muted Items", 'icon': "fa-microphone-slash" },
                      /*    'language': { 'label': "Languages", 'icon': "fa-comments-o" }, */
                          'refresh': { 'label': "Refresh Rate", 'icon': "fa-refresh" },
                          'widths': { 'label': "Column Widths", 'icon': "fa-arrows-h" }
                        };
            html += '<strong class="lbltxt">What Would You Like to Change?</strong>';
            for ( item in items ) {
                html += '<button id="btn-tl-' + item + '" class="btn btn-prefs" style="background-color: ' + bgColor + '; color: ' + frColor + '"' +
                               ' onClick="fillPrefsWindow(\'' + item + '\')">' +
                            '<i class="fa ' + items[item].icon + '"></i>' +
                            '<span>' + items[item].label + '</span>' +
                        '</button>';
            }
            html += '<button style="display: block; background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'main\');"><i class="fa fa-reply"></i> Back</button>';
            break;
        
        case 'refresh':
            var items = { '5': { 'label': "Seconds", 'icon': "5" },
                          '15': { 'label': "Seconds", 'icon': "15" },
                          '30': { 'label': "Seconds", 'icon': "30" },
                          '60': { 'label': "Minute", 'icon': "1" },
                          '300': { 'label': "Minutes", 'icon': "5" },
                          '99999': { 'label': "Never", 'icon': "&infin;" }
                        };
            var rrate = readStorage('refresh_rate');
            html += '<strong class="lbltxt" style="width: 95%; text-align: justify; padding: 0 2.5%;">' +
                        'How Often Should the Timelines Be Updated?' +
                    '</strong>';
            for ( item in items ) {
                var bg = '#' + readStorage('header_background'),
                    fr = '#' + readStorage('header_color');

                if ( item === rrate ) {
                    bg = '#' + readStorage('header_color');
                    fr = '#' + readStorage('header_background');
                }
                html += '<button id="btn-rr-' + item + '" class="btn btn-prefs" style="background-color: ' + bg + '; color: ' + fr + '"' +
                               ' onClick="setRefreshInterval(' + item + ')">' +
                            '<i>' + items[item].icon + '</i>' +
                            '<span>' + items[item].label + '</span>' +
                        '</button>';
            }
            html += '<button style="display: block; background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'prefs\');"><i class="fa fa-reply"></i> Back</button>';
            break;

        case 'streams':
            var items = { 'home': { 'label': "Home", 'icon': "fa-home" },
                          'mentions': { 'label': "Mentions", 'icon': "fa-comment" },
                          'global': { 'label': "Filtered Global", 'icon': "fa-globe" },
                          'pms': { 'label': "PMs", 'icon': "fa-lock" },
                          'interact': { 'label': "Interactions", 'icon': "fa-heartbeat" },
                          'add': { 'label': "Add", 'icon': "fa-plus" }
                        };
            for ( item in items ) {
                var bg = '#' + readStorage('header_background'),
                    fr = '#' + readStorage('header_color');
                if ( window.timelines[item] ) {
                    bg = '#' + readStorage('header_color');
                    fr = '#' + readStorage('header_background');
                }
                html += '<button id="btn-tl-' + item + '" class="btn btn-prefs" style="background-color: ' + bg + '; color: ' + fr + '"' +
                               ' onClick="toggleTimeline(\'' + item + '\')">' +
                            '<i class="fa ' + items[item].icon + '"></i>' +
                            '<span>' + items[item].label + '</span>' +
                        '</button>';
            }
            html += '<button style="display: block; background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'main\');"><i class="fa fa-reply"></i> Back</button>';
            break;

        case 'widths':
            var sb_adjust = readStorage('scrollbar_adjust');
            var sHeight = window.innerHeight || document.body.clientHeight;
            var sWidth = window.innerWidth || document.body.clientWidth;

            if ( isNaN(sb_adjust) || sb_adjust === false ) { sb_adjust = 0; } else { sb_adjust = parseInt(sb_adjust); }
            html  = '<strong class="lbltxt" style="width: 95%; text-align: justify; padding: 0 2.5%;">' +
                        'Column Widths Off a Bit? Adjust Them Here.' +
                    '</strong>' +
                    '<em class="lbltxt" style="display: block; width: 95%; text-align: justify; padding: 0 2.5%;">' +
                        'Note: Negative Numbers Expand the Columns, Positive Numbers Narrow the Columns' +
                    '</em>' +
                    '<label class="lbltxt">Width Adjustment</label>' +
                    '<input type="number" id="scroll_amt" max="50" min="-50" onChange="setColumnWidthAdjustment();" value="' + sb_adjust + '">' +
                    '<em class="lbltxt" style="display: block; width: 95%; text-align: justify; margin-top: 25px; padding: 0 2.5%;">' +
                        'Reported Screen Width: ' + sWidth + 'px / Height: ' + sHeight + 'px' +
                    '</em>';
            html += '<button style="display: block; background-color: ' + bgColor + '; color: ' + frColor + '"' +
                           ' onClick="fillPrefsWindow(\'prefs\');"><i class="fa fa-reply"></i> Back</button>';
            break;

        default:
            /* Do Nothing */
    }
    document.getElementById('pref-list').innerHTML = html;
}
function getButtonValue( id, item, type, on_click ) {
    var bgColor = '#' + readStorage('header_background'),
        frColor = '#' + readStorage('header_color');
    var strings = { 'ed': { on: "Enabled", off: "Disabled", icon: "fa-circle", icoff: "fa-circle-o" },
                    'ar': { on: "Absolute", off: "Relative", icon: "fa-circle", icoff: "fa-circle-o" },
                    'sh': { on: "Hidden", off: "Show", icon: "fa-circle", icoff: "fa-circle-o" },
                    'vh': { on: "Hidden", off: "Visible", icon: "fa-circle", icoff: "fa-circle-o" },
                    'yn': { on: "Yes", off: "No", icon: "fa-circle", icoff: "fa-circle-o" }
                   };
    var value = readStorage(item);
    var css = 'background-color: ' + bgColor + '; color: ' + frColor + ';';
    if ( value === 'Y' || value === true || value === 1 ) { css = 'background-color: ' + frColor + '; color: ' + bgColor + ';'; }

    var _html = '<button id="' + id + '" class="btn" style="' + css + '"';
    if ( on_click !== false && on_click !== '' ) { _html += ' onClick="' + on_click + '"'; }
    _html += '>';
    if ( value === 'Y' || value === true || value === 1 ) {
        _html += '<i class="fa ' + strings[type].icon + '"></i> ' + strings[type].on;
    } else {
        _html += '<i class="fa ' + strings[type].icoff + '"></i> ' + strings[type].off;
    }
    _html += '</button>';

    return _html;
}
function toggleTimeline( tl ) {
    if ( tl === 'add' ) {
        alert("[Debug] Sorry ... just a little more testing to do.");
        return false;
    }
    window.timelines[tl] = !window.timelines[tl];
    var bgColor = '#' + readStorage('header_color'),
        frColor = '#' + readStorage('header_background');
    if ( window.timelines[tl] ) {
        saveStorage('tl_' + tl, 'Y');
    } else {
        bgColor = '#' + readStorage('header_background'),
        frColor = '#' + readStorage('header_color');
        saveStorage('tl_' + tl, 'N');
    }
    document.getElementById('btn-tl-' + tl).style.backgroundColor = bgColor;
    document.getElementById('btn-tl-' + tl).style.color = frColor;
    showTimelines();
}
function getCSSPresets() {
    return  { 'current': {  'label': "Your Current Theme",
                            'style': {  'body_background': readStorage('body_background'),
                                        'header_background': readStorage('header_background'),
                                        'header_color': readStorage('header_color'),
                                        'post-name_color': readStorage('post-name_color'),
                                        'post-content_color': readStorage('post-content_color'),
                                        'post-mention_color': readStorage('post-mention_color'),
                                        'post-highlight_color': readStorage('post-highlight_color'),
                                        'avatar_color': readStorage('avatar_color'),
                                        'mention_color': readStorage('mention_color'),
                                        'one-week_color': readStorage('one-week_color'),
                                        'one-day_color': readStorage('one-day_color')
                                        }
                            },

            'default': {  'label': "Default Theme",
                            'style': {  'body_background': 'fff',
                                        'header_background': '777',
                                        'header_color': 'fff',
                                        'post-name_color': '333',
                                        'post-content_color': '000',
                                        'post-mention_color': '333',
                                        'post-highlight_color': 'eee',
                                        'avatar_color': 'ccc',
                                        'mention_color': '00f',
                                        'one-week_color': 'd9534f',
                                        'one-day_color': 'ff0'
                                        }
                            },

            'jextxadore': { 'label': "@jextxadore Dark",
                            'style': {  'body_background': '333333',
                                        'header_background': '1f1f1f',
                                        'header_color': 'fff',
                                        'post-name_color': 'd1d1d1',
                                        'post-content_color': 'b4b4b4',
                                        'post-mention_color': 'd1d1d1',
                                        'post-highlight_color': '4c4c4c',
                                        'avatar_color': '999999',
                                        'mention_color': '297acc',
                                        'one-week_color': 'd9534f',
                                        'one-day_color': 'cc99ff'
                                        }
                            },

            'pme': {        'label': "@pme Preferred",
                            'style': {  'body_background': 'eff',
                                        'header_background': '77e',
                                        'header_color': 'fff',
                                        'post-name_color': '333',
                                        'post-content_color': '000',
                                        'post-mention_color': '333',
                                        'post-highlight_color': 'eee',
                                        'avatar_color': 'd95',
                                        'mention_color': '00f',
                                        'one-week_color': 'd9534f',
                                        'one-day_color': 'ff0'
                                        }
                            },

            'hotdog': {     'label': "Hotdog Stand",
                            'style': {  'body_background': 'f00',
                                        'header_background': '000',
                                        'header_color': 'fff',
                                        'post-name_color': 'ff0',
                                        'post-content_color': '000',
                                        'post-mention_color': 'ff0',
                                        'post-highlight_color': 'd9534f',
                                        'avatar_color': '000',
                                        'mention_color': 'ff0',
                                        'one-week_color': 'd9534f',
                                        'one-day_color': '0f0'
                                        }
                            }
            };
}
function loadCSSPreset( preset ) {
    var presets = getCSSPresets();
    for ( i in presets[preset].style ) {
        document.getElementById(i).value = presets[preset]['style'][i];
        validateHexColorAndPreview(i);
    }
}
function saveCSSPreferences() {
    var items = ['body_background', 'header_background', 'header_color',
                 'post-name_color', 'post-content_color', 'post-mention_color', 'post-highlight_color',
                 'avatar_color', 'mention_color', 'one-week_color', 'one-day_color'];
    for ( var i = 0; i < items.length; i++ ) {
        var hex = document.getElementById(items[i]).value.replaceAll('#', '');
        var isOk  = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(hex);
        if ( isOk ) { saveStorage( items[i], hex ); }
    }
    setCSSPreferences();
}
function validateHexColorAndPreview( elID ) {
    var hex = document.getElementById(elID).value.replaceAll('#', '');
    var isOk  = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(hex);
    if ( isOk ) { document.getElementById('prev' + elID).style.backgroundColor = '#' + hex; }
}
function toggleOption( item, txt ) {
    var bgColor = '#' + readStorage('header_color'),
        frColor = '#' + readStorage('header_background');
    var txtOpts = { 'ed': {'enabled': "Enabled", 'disabled': "Disabled"},
                    'ar': {'enabled': "Absolute", 'disabled': "Relative"},
                    'hc': {'enabled': "Hidden", 'disabled': "Collapsed"},
                    'sh': {'enabled': "Hidden", 'disabled': "Show"},
                    'vh': {'enabled': "Hidden", 'disabled': "Visible"},
                    'yn': {'enabled': "Yes", 'disabled': "No"},
                   };
    var value = readStorage(item);
    if ( value === 'Y' ) { value = false; } else { value = true; }
    saveStorage(item, ((value) ? 'Y' : 'N'));

    var elementExists = document.getElementById('btn-opt-' + item);
    if ( elementExists !== null && elementExists !== undefined ) {
        document.getElementById('btn-opt-' + item).style.backgroundColor = (( value ) ? bgColor : frColor);
        document.getElementById('btn-opt-' + item).style.color = (( value ) ? frColor : bgColor);
        document.getElementById('btn-opt-' + item).innerHTML = (( value ) ? '<i class="fa fa-circle"></i> ' + txtOpts[txt]['enabled']
                                                                          : '<i class="fa fa-circle-o"></i> ' + txtOpts[txt]['disabled']);
    }
}
function togglePostElement( item ) {
    var value = readStorage( item );
    var cls = '';
    
    switch ( item ) {
        case 'hide_audio':
            cls = '.post-audio';
            break;
        
        case 'hide_avatars':
            cls = '.post-avatar';
            break;

        case 'hide_images':
            cls = '.post-image';
            break;
        
        case 'hide_geodata':
            cls = '.post-geo';
            break;
    }
    jss.set('.post-list .post-item ' + cls, { 'display': (( value === 'N' ) ? 'block' : 'none') });
}
function getTimestamp( created_at, show_something ) {
    var at_value = readStorage('absolute_times'),
        live_value = readStorage('show_live_timestamps'),
        show_24h = readStorage('show_24h_timestamps');
    var rVal = '';
    if ( at_value === 'Y' ) {
        var i = 0;
        while ( moment === undefined || moment === null ) { setTimeout(function() { i++; }, 250); }
        moment.locale('en');
        if ( show_24h === 'Y' ) {
            rVal = moment( created_at ).format("MMMM Do YYYY HH:mm");
        } else {
            rVal = moment( created_at ).format("MMMM Do YYYY h:mma");
        }
    } else {
        rVal = ((live_value === 'Y' || show_something === true ) ? humanized_time_span( created_at ) : '<em>more...</em>');
    }
    return rVal;
}
function setTimestamps() {
    for ( post_id in window.posts ) {
        var itms = document.getElementsByName( post_id + "-time" );
        var tStr = getTimestamp( window.posts[post_id].created_at ),
            html = '';

        for ( var i = 0; i < itms.length; i++ ) {
            html = document.getElementById( itms[i].id ).innerHTML;
            if ( html != tStr ) { document.getElementById( itms[i].id ).innerHTML = tStr; } else { break; }
        }
    }
}
function removeHashFilter( name ) {
    if ( unmuteHashtag(name) ) {
        var btns = document.getElementsByName('hashes');
        for ( i in btns ) {
            if ( btns[i].value === name ) { btns[i].innerHTML = 'Scrubbed'; }
        }
    }
}
function fillAcctsWindows() {
    saveStorage('msgTitle', 'Ack!', true);
    saveStorage('msgText', 'I wish this were ready to go. I really do. Check back later :)', true);
    if ( constructDialog('okbox') ) { toggleClassIfExists('okbox','hide','show'); }
}