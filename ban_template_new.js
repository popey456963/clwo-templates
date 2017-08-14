let previous = []
let current_question = 0

let forums = {
  7: '[Jailbreak] (un)ban/teamunban/teamunlock section',
  14: '[Jailbreak] Staff Infractions & Complaints',
  43: '[TTT] Unban Appeal and Ban Requests',
  69: '[Deathrun] Unban Appeal and Ban Requests'
}

let survey = {
  0: {
    question: 'What do you want to do?',
    answers: [{
      type: 'radio',
      route: 1,
      item: 'Report a player'
    }, {
      type: 'radio',
      route: 50,
      item: 'Request to be unbanned'
    }]
  },
  1: {
    question: 'Who do you want to report?',
    answers: [{
      type: 'radio',
      route: 2,
      item: 'A staff member'
    }, {
      type: 'radio',
      route: 2,
      item: 'A normal player'
    }]
  },
  2: {
    question: 'What is the players name?',
    answers: [{
      type: 'text',
      route: 3,
      placeholder: 'Jack'
    }]
  },
  3: {
    question: 'Do you know his/her SteamID (2/3/64)?',
    answers: [{
      type: 'radio',
      route: 4,
      item: 'Yes'
    }, {
      type: 'radio',
      route: 5,
      item: 'No'
    }]
  },
  4: {
    question: 'What is his/her SteamID?',
    answers: [{
      type: 'text',
      route: 5,
      placeholder: 'STEAM_0:0:11101 | [U:1:22202] | 86561198960288930'
    }]
  },
  5: {
    question: 'What is the date of the incident (roughly)?',
    answers: [{
      type: 'date',
      route: 6
    }]
  },
  6: {
    question: 'What did this person do?',
    answers: [{
      type: 'text',
      route: 7,
      placeholder: 'e.g. gave out personal details'
    }]
  },
  7: {
    question: 'Do you have evidence?',
    answers: [{
      type: 'radio',
      route: 8,
      item: 'Yes'
    }, {
      type: 'radio',
      route: -1,
      item: 'No'
    }]
  },
  8: {
    question: 'Please link to the evidence here.',
    answers: [{
      type: 'text',
      route: -1,
      placeholder: 'e.g. video of incident www.youtube.com/watch?v=example'
    }]
  },
  50: {
    question: 'How have you been banned?',
    answers: [{
      type: 'radio',
      route: 60,
      item: 'Banned from a server'
    }, {
      type: 'radio',
      route: -1,
      item: 'Blacklisted from community'
    }, {
      type: 'radio',
      route: 52,
      item: 'Teambanned from CT'
    }, {
      type: 'radio',
      route: 51,
      item: 'Teamlocked from CT'
    }]
  },
  51: {
    question: 'How long is your teamlock?',
    answers: [{
      type: 'text',
      route: 52,
      placeholder: 'e.g. 100'
    }]
  },
  52: {
    question: 'Why do you want to be unbanned from CT?',
    answers: [{
      type: 'text',
      route: 53,
      placeholder: ''
    }]
  },
  53: {
    question: 'Please provide a screenshot of the teamban message.',
    answers: [{
      type: 'text',
      route: -1,
      placeholder: 'https://i.imgur.com/example.png'
    }]
  },
  59: {
    question: 'When were you banned (roughly)?',
    answers: [{
      type: 'date',
      route: 62
    }]
  },
  60: {
    question: 'Which server were you banned from?',
    answers: [{
      type: 'radio',
      route: 61,
      item: 'Jailbreak'
    }, {
      type: 'radio',
      route: 61,
      item: 'Trouble in Terrorist Town'
    }, {
      type: 'radio',
      route: 61,
      item: 'Deathrun'
    }]
  },
  61: {
    question: 'What is your in game name?',
    answers: [{
      type: 'text',
      route: 59,
      placeholder: 'e.g. Jack'
    }]
  },
  62: {
    question: 'Why were you banned from the server?',
    answers: [{
      type: 'text',
      route: 63,
      placeholder: 'e.g. Freekilling'
    }]
  },
  63: {
    question: 'Why do you want to get unbanned?',
    answers: [{
      type: 'text',
      route: 64,
      placeholder: ''
    }]
  },
  64: {
    question: 'What have you done to improve?',
    answers: [{
      type: 'text',
      route: -1,
      placeholder: ''
    }]
  }
}

function add_question(index, item) {
  // Add question to HTML
  $('.questions-container').append(`
    <div class='question question-${index}'>
      <p>${item.question}</p>
      <div class='answers-${index}'></div>
    </div>
  `)

  // Add answers
  item.answers.forEach((answer_item, answer_index) => {
    console.log(answer_item, answer_index)
    add_answer(index, answer_index, answer_item)
  })
}

function add_answer(question_index, index, item) {
  // Add answer to html
  if (item.type == 'radio') {
    $(`.answers-${question_index}`).append(`
      <div class='survey-item'>
        <input name='radio-${question_index}' type='radio' id='radio-${question_index}-${index}' data-question='${question_index}' data-answer='${index}' value='${item.item}' />
        <label for='radio-${question_index}-${index}'>
          <span></span>
          <p>${item.item}</p>
        </label>
      </div>
    `)
  }
  if (item.type == 'text') {
    $(`.answers-${question_index}`).append(`
      <div class='survey-item'>
        <input type='text' placeholder='${item.placeholder}' data-question='${question_index}'
      </div>
    `)
  }
  if (item.type == 'date') {
    $(`.answers-${question_index}`).append(`
      <div class='survey-item'>
        <input type='text' class='datetimepicker' id='datetimepicker-${question_index}' data-question='${question_index}' data-format='mm/dd/yyyy hh:mm' />
      </div>
    `)
  }
}

function jump_question(question, ignoreHistory) {
  question = question | 0
  console.log(`Switching to question ${question} from ${current_question}`)
  if (question == -1) {
    // We have finished the questionaire.
    console.log('Questionaire finished')
    $('.results-container').html('')
    display_data(retrieve_data())
    $('.results').slideDown()
    $('.questions').slideUp()
  } else if (current_question == -1) {
    console.log('Changing values')
    $('.results').slideUp()
    $('.questions').slideDown()
  } else {
    $(`.question`).removeClass('active')
    $(`.question-${question}`).addClass('active')
  }

  if (!ignoreHistory) previous.push(current_question)
  current_question = question
  console.log(`Changed current page to ${current_question}`)
  if (question != -1) enable_buttons()
}

function next() {
  let checked_box = $(`input[name='radio-${current_question}']:checked`)
  if (survey[current_question].answers.some((e) => e.type != 'radio')) {
    jump_question(survey[current_question].answers[0].route)
  } else if (checked_box.val()) {
    jump_question(survey[checked_box.data('question')].answers[checked_box.data('answer')].route)
  }
}

function enable_buttons() {
  previous.length ? $('.prev').removeClass('hidden') : $('.prev').addClass('hidden')
  if (survey[current_question].answers.some((e) => e.type != 'radio') || $(`input[name='radio-${current_question}']:checked`).val()) {
    $('.next').removeClass('hidden')
  } else {
    $('.next').addClass('hidden')
  }
}

function retrieve_data() {
  let data = {}
  for (let question in survey) {
    let question_type = survey[question].answers[0].type
    if (question_type == 'radio') {
      data[question] = $(`input[name='radio-${question}']:checked`).val()
    } else if (['text', 'date'].includes(question_type)) {
      data[question] = $(`input[data-question='${question}']`).val()
    }
  }
  return data
}

function display_data(data) {
  if (data[0] == 'Report a player') report_player(data)
  if (data[0] == 'Request to be unbanned') unban_player(data)
  $('.results-container').append(`<span>${JSON.stringify(data)}</span>`)
  console.log(data)
}

function report_player(data) {
  let forum = data[1] == 'A normal player' ? 7 : 14
  let title = `Report against ${data[2]}`
  let text = `[b]Player:[/b] ${data[2]} ${ data[3] == 'Yes' ? `(${data[4]})` : `` }
[b]Date:[/b] ${data[5]}
[b]Reason:[/b] ${data[6]}
[b]Evidence:[/b] ${ data[7] == 'Yes' ? data[8] : `None.` }
[b]Context:[/b] <!-- Explain situation in more detail here -->
`.split(/\r?\n/).join('<br />')

  post(`<h1>Post the following in the <a href='https://clwo.eu/forum-${forum}.html'>${forums[forum]}</a>:</h1>`)
  post(`<p>Set the title to be: ${title}`)
  post(`<p class='text'>${text}</p>`)
}

function unban_player(data) {
  if(data[50] == 'Blacklisted from community') {
    post(`<h1>Go to the <a href='https://clwo.eu/jailbreak/admin/view-blacklist.php'>list of blacklists</a> and appeal from there.`)
  } else if (data[50] == 'Banned from a server') {
    let forum = 0
    let title = `Unban request for ${data[61]}`
    let text = `
[b]Ban Reason:[/b] ${data[62]}
[b]Date of Ban:[/b] ${data[59]}
[b]Reason for Unban:[/b] ${data[63]}
[b]Improvements Made:[/b] ${data[64]}
`.split(/\r?\n/).join('<br />')
    if (data[60] == 'Jailbreak') forum = 7
    if (data[60] == 'Trouble in Terrorist Town') forum = 43
    if (data[60] == 'Deathrun') forum = 69
    post(`<h1>Post the following in the <a href='https://clwo.eu/forum-${forum}.html'>${forums[forum]}</a>:</h1>`)
    post(`<p>Set the title to be: ${title}`)
    post(`<p class='text'>${text}</p>`)
  } else if (['Teambanned from CT', 'Teamlocked from CT'].includes(data[50])) {
    
  }
}

function post(data) {
  $('.results-container').append(data)
}

$(function() {
  // Add each question to the document
  for (let question in survey) {
    add_question(question, survey[question])
  }

  // Fix for spotty appearance
  $('.results').hide()
  $('.results').removeClass('hidden')

  // On radio button click, msove to next screen
  $(`input[type='radio']`).click((item) => {
    let question = item.target.dataset.question
    let answer = item.target.dataset.answer
    jump_question(survey[question].answers[answer].route)
  })

  $('.prev').click(() => {
    jump_question(previous.pop(), true)
  })

  $('.back').click(() => {
    jump_question(previous.pop(), true)
  })

  $('.next').click(next)
  $(`input[type='text']`).keyup((e) => { if (e.keyCode == 13) { next() } })

  // Activate date time pickers
  $('.datetimepicker').datetimepicker()

  // Activate the first one
  $('.question-0').addClass('active')
  enable_buttons()
})
