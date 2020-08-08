const globalVariables = {
  view: {
    start: 'StartView',
    main: 'MainView',
    addFilm: 'AddFilmView',
    test: 'TestView',
    connectionLost: 'ConnectionLost',
  },
  commonView: {
    roots: {
      main: 'MainRoot',
      homework: 'HomeworkRoot',
      shop: 'ShopRoot',
      leaderboard: 'LeaderboardRoot',
      history: 'HistoryRoot',
    },
    panels: {
      main: 'Main',
      settings: 'Settings',
      history: 'History',
      battleParticipant: 'BattleParticipant',

      questionsList: 'QuestionsList',
      questionDetails: 'QuestionDetails',
      rejectedQuestion: 'RejectedQuestion',
      homework: 'Homework',
      shop: 'Shop',
      shopQuestion: 'ShopQuestion',
      shopResult: 'ShopResult',
      leaderboard: 'Leaderboard',
    },
  },
  introductionComplete: 'introductionComplete',
  authToken: 'authToken',
  friendsAccessToken: 'friendsAccessToken',
  notificationAllow: 'notificationAllow',
  serverURL: 'https://e4c6e297fd38.ngrok.io',
  quizResult: 'quizResult',
  quizQuestions: 'quizQuestions',
  tooltips: 'tooltips',
  translateEnToRu(category) {
    switch (category) {
      case 'All':
        return 'Все';
      case 'Math':
        return 'Математика';
      case 'Russian':
        return 'Русский язык';
      case 'Literature':
        return 'Литература';
      case 'Physics':
        return 'Физика';
      case 'Chemistry':
        return 'Химия';
      case 'Astronomy':
        return 'Астрономия';
      case 'Biology':
        return 'Биология';
      case 'History':
        return 'История';
      case 'Art':
        return 'Искусство';
      case 'Sport':
        return 'Спорт';
      case 'Geography':
        return 'География';
      case 'Other':
        return 'Другое';
      default:
        return category;
    }
  },
  categoryColor(category) {
    switch (category) {
      case 'Math':
        return '#E64646';
      case 'Russian':
        return '#857250';
      case 'Literature':
        return '#FFA000';
      case 'Physics':
        return '#3F8AE0';
      case 'Chemistry':
        return '#792EC0';
      case 'Astronomy':
        return '#6D7885';
      case 'Biology':
        return '#4CD964';
      case 'History':
        return '#63B9BA';
      case 'Art':
        return '#E5188F';
      case 'Sport':
        return '#28436E';
      case 'Other':
        return '#909499';
      case 'Geography':
        return '#4BB34B';
      default:
        return '';
    }
  },
  mainViewModal(name) {
    switch (name) {
      case 'Tax': return 'TaxDetailsModalPage';
      case 'GPtoday': return 'GPDetailsModalPage';
      case 'CoinsToday': return 'CoinsDetailsModalPage';
      case 'Mindopolist': return 'MindopolistDetailsModalPage';
      case 'Pioneer': return 'PioneerModalPage';
      case 'Master': return 'MasterModalPage';
      case 'Members': return 'MembersModalPage';
      case 'Settings': return 'SettingsModalPage';
      default: return null;
    }
  },
  leaderboardBadgeType: {
    master: 'leaderboardBadgeMaster',
  },
  maxUnapprovedQuestionCount: 12,

  getReasonByCode(code) {
    switch (code) {
      case 10: return 'Копия чужого вопроса';
      case 11: return 'Нет образовательно подтекста';
      case 12: return 'Непостоянная информация';
      case 13: return 'Ненормативная лексика';
      case 14: return 'Некорректный набор ответов';
      case 15: return 'Невозможно проверить правильность ответа';
      case 16: return 'Особое решение администрации';
      default: return null;
    }
  },
  getReasonDescriptionByCode(code) {
    switch (code) {
      case 10: return 'Этот вопрос принадлежит другому игроку. Мы вернули потраченные монеты на Ваш счёт.';
      case 11: return 'К сожалению, этот вопрос не несет образовательного контекста. Мозгополия – образовательная мини-игра. Мы вернули потраченные монеты на Ваш счёт.';
      case 12: return 'Правильный ответ на этот вопрос может измениться в будущем. Мы вернули потраченные монеты на Ваш счёт.';
      case 13: return 'Мы не одобряем ненормативную лексику в вопросах. В Мозгополии зарегистрированы дети. Мы вернули потраченные монеты на Ваш счёт.';
      case 14: return 'К сожалению, набор ответов не подходят по смыслу к Вашему вопросу. Мы вернули потраченные монеты на Ваш счёт.';
      case 15: return 'К сожалению, нам не удалось проверить правильность ответа на этот вопрос. Мы вернули потраченные монеты на Ваш счёт.np';
      case 16: return 'Особое решение администрации';
      default: return null;
    }
  },
  notificationType: {
    QuestionResult: 'QuestionResult',
    Achievement: 'Achievement',
  },
};

export default globalVariables;
