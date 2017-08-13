$(function() {
    var final = [7]
    var survey = {
        1: {
            'question': 'What do you want to do?',
            'answer': {
                1: {
                    'type': 'radio',
                    'dynamic': true,
                    'route': 2,
                    'item': 'Report a player'
                },
                2: {
                    'type': 'radio',
                    'dynamic': true,
                    'route': 6,
                    'item': 'Request to be unbanned'
                }
            }
        },
        2: {
            'question': 'Who do you want to report?',
            'answer': {
                1: {
                    'type': 'radio',
                    'dynamic': true,
                    'route': 3,
                    'item': 'A staff member'
                },
                2: {
                    'type': 'radio',
                    'dynamic': true,
                    'route': 3,
                    'item': 'A normal player'
                }
            }
        },
        3: {
            'question': 'What is his/her name?',
            'answer': {
                1: {
                    'type': 'text',
                    'dynamic': true,
                    'route': 4,
                    'placeholder': 'Jack',
                    'identity': 'mm-dynamic-name'
                }
            }
        },
        4: {
            'question': 'Do you know his/her SteamID (2/3/64)?',
            'answer': {
                1: {
                    'type': 'radio',
                    'dynamic': true,
                    'route': 5,
                    'item': 'Yes'
                },
                2: {
                    'type': 'radio',
                    'dynamic': true,
                    'route': 7,
                    'item': 'No'
                }
            }
        },
        5: {
            'question': 'What is his/her SteamID?',
            'answer': {
                1: {
                    'type': 'text',
                    'dynamic': true,
                    'route': 7,
                    'placeholder': 'STEAM_0:0:11101 | [U:1:22202] | 76561197960287930',
                    'identity': 'mm-dynamic-steamid'
                }
            }
        },
        6: {
            'question': 'How have you been banned?',
            'answer': {
                1: {
                    'type': 'radio',
                    'dynamic': true,
                    'route': 7,
                    'item': 'Teambanned from CT'
                },
                2: {
                    'type': 'radio',
                    'dynamic': true,
                    'route': 7,
                    'item': 'Teamlocked from CT'
                },
                3: {
                    'type': 'radio',
                    'dynamic': true,
                    'route': 7,
                    'item': 'Banned from server'
                },
                4: {
                    'type': 'radio',
                    'dynamic': true,
                    'route': 7,
                    'item': 'Blacklisted from network'
                }
            }
        },
        7: {
            'question': 'End of Questionnaire.',
            'answer': {}
        },
    };

    for (var i = 1; i <= Object.keys(survey).length; i++) {

        var data, container, content;
        data = survey[i];
        container = jQuery('.mm-survey-container');
        content = '<div class="mm-survey-page mm-survey-page-' + i + '" data-page="' + i + '">' +
            '<div class="mm-survery-content">' +
            '<div class="mm-survey-question"><p>' + data.question + '</p></div>' +
            '</div>' +
            '</div>';
        container.append(content);

        if (Object.keys(data.answer).length < 1) {
            jQuery('.mm-survey-page-' + i + ' .mm-survery-content').append('<p>Please press "submit".</p>');
        } else {
            for (var ii = 1; ii <= Object.keys(data.answer).length; ii++) {

                var datax, containerx, contentx;
                datax = data.answer[ii];
                containerx = jQuery('.mm-survey-page-' + i + ' .mm-survery-content');

                switch (datax.type) {
                    case 'radio':
                        contentx = '<div class="mm-survey-item mm-dynamic">' +
                            '<input type="radio" id="radio' + i + '0' + ii + '" data-group="' + i + '" data-dynamic="' + datax.route + '" data-item="' + ii + '" name="radio' + i + '" value="' + datax.item + '" />' +
                            '<label for="radio' + i + '0' + ii + '"><span></span><p>' + datax.item + '</p></label>' +
                            '</div>';
                        break;
                    case 'text':
                        contentx = '<div class="mm-survey-item mm-dynamic-input">' +
                            '<input type="text" class="' + datax.identity + '" data-group="' + i + '" data-dynamic="' + datax.route + '" placeholder="' + datax.placeholder + '" />' +
                            '</div>';
                        break;
                    case 'date':
                        contentx = '<div class="mm-survey-item mm-dynamic-datetime">' +
                            '<input type="text" class="' + datax.identity + '" id="datetimepicker-' + i + '" data-datetimeid="' + i + '" data-group="' + i + '" data-dynamic="' + datax.route + '" data-format="mm/dd/yyyy hh:mm" />' +
                            '</div>';
                        break;
                    case 'form':
                        contentx = '<div class="mm-dynamic-form-item">' +
                            '<p>' + datax.title + '</p>' +
                            '<div class="mm-survey-item mm-dynamic-form">' +
                            '<input type="text" class="' + datax.identity + '" data-group="' + i + '" data-dynamic="' + datax.route + '" placeholder="' + datax.placeholder + '" />' +
                            '</div>' +
                            '</div>';
                        break;
                }

                containerx.append(contentx);

            }
        }
    }

    jQuery('.mm-survey-page:first').addClass('active mm-dynamic-active');
    jQuery('.mm-prev-btn').hide();

    var x;
    var xyz;
    var xtx;
    var count;
    var current;
    var percent;
    var z = [];

    init();
    goToNext();
    goToPrev();
    getCount();
    buildStatus();
    deliverStatus();
    goBack();

    function init() {

        jQuery('.mm-survey-container .mm-survey-page').each(function() {

            var item;
            var page;

            item = jQuery(this);
            page = item.data('page');

            item.addClass('mm-page-' + page);

        });

    }

    jQuery('.mm-finish-btn').on('click', function() {
        collectData();
        jQuery('.mm-survey-bottom').slideUp();
        jQuery('.mm-survey-results').slideDown();
    });

    function getCount() {
        count = jQuery('.mm-survey-page').length;
        return count;
    }

    function dynamicForm() {
        jQuery('.mm-dynamic-form-item').wrapAll('<div class="mm-dynamic-form-wrap">');
        jQuery('.mm-survey-item input').on('keyup', function() {
            var item, id, form;
            item = jQuery(this);
            id = item.closest('.mm-survey-page').data('page');
            form = item.closest('.mm-dynamic-form-wrap');
            form.addClass('mm-dynamic-form-' + id);
        });
    }

    dynamicForm();

    function checkDate() {
        jQuery('.mm-dynamic-date').on('dp.change', function() {
            var item, id;
            item = jQuery(this);
            id = item.data('datetimeid');
            // jQuery('.mm-survey-page').removeClass('active');
            xyz = item.data('dynamic');
            jQuery('.mm-page-' + id).addClass('pass');
            item.parent().addClass('bingo');
            // jQuery('.mm-page-'+xyz).addClass('active mm-dynamic-active');
            buttonConfig(id);
        });
    }

    function runInputs(e, f) {
        function ensureKey(dynamic_class) {
            jQuery('.' + dynamic_class).on('keyup', function() {
                let key = jQuery(this);
                var value = jQuery(this).val();
                if (value.length > 1) {
                    key.parent().addClass('bingo');
                    jQuery('.mm-page-' + f).addClass('pass');
                    buttonConfig(f);
                } else {
                    key.parent().removeClass('bingo');
                    jQuery('.mm-page-' + f).removeClass('pass');
                    buttonConfig(f);
                }
            });
        }

        ensureKey('mm-dynamic-steamid')
        ensureKey('mm-dynamic-name')
    }

    function goToSkip() {

        jQuery('.mm-survey-item').on('click', function() {

            var item, input, xyz, y, paragraph, title, page;

            item = jQuery(this);
            page = item.closest('.mm-survey-page').data('page');
            jQuery('.mm-page-' + page + ' .mm-survey-item').removeClass('bingo');

            getCount();
            y = (count);

            if (item.hasClass('mm-dynamic')) {
                jQuery('.mm-survey-page').removeClass('active');
                input = item.children('input');
                xyz = input.data('dynamic');
                jQuery('.mm-page-' + xyz).addClass('active mm-dynamic-active').attr('data-orgin', page);
                if (~final.indexOf(xyz)) {
                    console.log('final page detected1');
                    collectData();
                    jQuery('.mm-survey-bottom').slideUp();
                    jQuery('.mm-survey-results').slideDown();
                }
                item.addClass('bingo');
                buildButtons(xyz, y);
                buttonConfig(xyz);
            } else if (item.hasClass('mm-dynamic-input')) {
                page = item.closest('.mm-survey-page').data('page');
                jQuery('.mm-page-' + page).removeClass('pass');
                input = item.children('input');
                xyz = input.data('dynamic');
                jQuery('.mm-page-' + xyz).attr('data-orgin', page);
                runInputs(xyz, page);
                buildButtons(page, y);
            } else if (item.hasClass('mm-dynamic-datetime')) {
                page = item.closest('.mm-survey-page').data('page');
                // jQuery('.mm-page-'+page).removeClass('pass');
                input = item.children('input');
                xyz = input.data('dynamic');
                jQuery('.mm-page-' + xyz).attr('data-orgin', page);
                checkDate();
                buildButtons(page, y);
            } else if (item.hasClass('mm-dynamic-form')) {
                page = item.closest('.mm-survey-page').data('page');
                jQuery('.mm-page-' + page).removeClass('pass');
                input = item.children('input');
                xyz = input.data('dynamic');
                jQuery('.mm-page-' + xyz).attr('data-orgin', page);
                runInputs(xyz, page);
                buildButtons(page, y);
            } else {
                jQuery('.mm-survey-page').removeClass('active');
                page = item.closest('.mm-survey-page').data('page');
                jQuery('.mm-page-' + (page + 1)).addClass('active').attr('data-orgin', page);
                jQuery('.mm-page-' + page + ' .mm-survey-item').addClass('bingo');
                buildButtons((page + 1), y);
                buttonConfig(page + 1);
            }

            return x;

        });

    }

    goToSkip();

    function goToNext() {

        jQuery('.mm-next-btn').on('click', function() {
            var g, y, paragraph, title;

            goToSkip();
            getCurrentSlide();
            getCount();

            current = (x + 1);
            g = current / count;
            y = (count + 1);

            if (jQuery('.mm-page-' + x).hasClass('mm-dynamic-active')) {
                var xyz;
                xyz = jQuery('.mm-page-' + x + ' .bingo input').data('dynamic');
                buildButtons(xyz, count);
                buttonConfig(xyz);

                jQuery('.mm-survey-page').removeClass('active');
                jQuery('.mm-page-' + xyz).addClass('active mm-dynamic-active');
                if (~final.indexOf(xyz)) {
                    console.log('final page detected1');
                    collectData();
                    jQuery('.mm-survey-bottom').slideUp();
                    jQuery('.mm-survey-results').slideDown();
                }
            } else {
                buildButtons(current, count);
                buttonConfig(current);

                jQuery('.mm-survey-page').removeClass('active');
                jQuery('.mm-page-' + current).addClass('active');
            }

        });

    }

    function goToPrev() {

        jQuery('.mm-prev-btn').on('click', function() {
            var g, y, paragraph, title, orgin;

            goToSkip();
            getCurrentSlide();
            getCount();

            current = (x - 1);
            g = current / count;
            y = count;

            if (jQuery('.mm-page-' + x).hasClass('mm-dynamic-active')) {
                orgin = jQuery('.mm-page-' + x).data('orgin');
                jQuery('.mm-page-' + x).removeClass('mm-dynamic-active pass');
                jQuery('.mm-page-' + x).attr('data-orgin', '');
                jQuery('.mm-page-' + x + ' input:radio').removeAttr('checked');
                jQuery('.mm-survey-page').removeClass('active');
                jQuery('.mm-page-' + orgin).addClass('active');
                buildButtons(orgin, count);
                buttonConfig(orgin);
            } else {
                buildButtons(current, count);
                buttonConfig(current);
                jQuery('.mm-survey-page').removeClass('active');
                jQuery('.mm-page-' + current).addClass('active');

                paragraph = jQuery('.mm-paragraph-' + current).data('paragraph');
                jQuery('.mm-paragraph-content p').html(paragraph);
                title = jQuery('.mm-page-' + current).data('group');
                jQuery('.mm-project-page-title h3').html(title);

                jQuery('.mm-slide-page-number').html(current);
            }

        });

    }

    function getCurrentSlide() {
        jQuery('.mm-survey-page').each(function() {
            var item;
            item = jQuery(this);
            if (jQuery(item).hasClass('active')) {
                x = item.data('page');
                xtx = item.data('page');
            }
            return x;
        });
    }

    function buildButtons(a, b) {
        if (a == 1) {
            jQuery('.mm-next-btn').show();
            jQuery('.mm-prev-btn').hide();
            jQuery('.mm-finish-btn').hide();
        } else if (~final.indexOf(a)) {
            jQuery('.mm-next-btn').hide();
            jQuery('.mm-prev-btn').show();
            jQuery('.mm-finish-btn').show();
        } else {
            jQuery('.mm-next-btn').show();
            jQuery('.mm-prev-btn').show();
            jQuery('.mm-finish-btn').hide();
        }
    }

    function checkStatus() {
        jQuery('.mm-survery-content .mm-survey-item').on('click', function() {
            var item;
            item = jQuery(this);
            item.closest('.mm-survey-page').addClass('pass');
        });
    }

    function buildStatus() {
        jQuery('.mm-survery-content .mm-survey-item').on('click', function() {
            var item;
            item = jQuery(this);
            item.addClass('bingo');
            item.closest('.mm-survey-page').addClass('pass');
            jQuery('.mm-survey-container').addClass('good');
        });
    }

    function deliverStatus() {
        jQuery('.mm-survey-item').on('click', function() {
            if (jQuery('.mm-survey-container').hasClass('good')) {
                jQuery('.mm-survey').addClass('okay');
            } else {
                jQuery('.mm-survey').removeClass('okay');
            }
            buttonConfig();
        });
    }

    function buttonConfig(mat) {
        if (jQuery('.mm-survey-page-' + mat).hasClass('pass')) {
            jQuery('.mm-next-btn button').addClass('ready').prop('disabled', false);
        } else {
            // jQuery('.mm-next-btn button').removeClass('ready').prop('disabled', true);
        }
    }

    function collectData() {

        var map = {};
        var answer = '';
        var total = 0;
        var ttl = 0;
        var g;
        var c = 0;
        var newCount = jQuery('.pass .mm-survey-item.bingo').length;

        jQuery('.mm-survey-results-container .mm-survey-results-list').html('');

        var log = {}

        jQuery('.mm-survey-item.bingo input').each(function(index, val) {
            var item, id, data, name, n;

            item = jQuery(this);
            id = item.data('group');
            data = item.val();
            name = item.data('item');
            log[id] = data
            jQuery('.mm-survey-results-list').append('<li class="mm-survey-results-item correct"><span class="mm-item-number">' + (index + 1) + '</span><span class="mm-item-info">' + survey[id].question + ' - ' + data + '</span></li>');
        });

        console.log(log)
    }

    function goBack() {
        jQuery('.mm-back-btn').on('click', function() {
            jQuery('.mm-survey-bottom').slideDown();
            jQuery('.mm-survey-results').slideUp();
        });
    }

    jQuery('#datetimepicker-15').datetimepicker();

});
