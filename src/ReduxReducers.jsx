import bridge from '@vkontakte/vk-bridge';
import globalVariables from './GlobalVariables';

export function schemeChanger(state = { scheme: 'light', quizResult: [] }, action) {
  switch (action.type) {
    case 'UPDATE_SCHEME':
      return {
        ...state,
        scheme: action.payload,
      };
    default:
      return state;
  }
}

export function quiz(state = {
  quizResult: [],
  questions: [],
  reportQuestionID: '',
  confirmReportByQuestionID: '',
}, action) {
  switch (action.type) {
    case 'UPDATE_QUIZ_RESULT':
      return {
        ...state,
        ...action.payload,
      };
    case 'CLEAR_QUIZ_RESULT':
      return {
        quizResult: [],
        questions: [],
        reportQuestionID: '',
        confirmReportByQuestionID: '',
      };
    default:
      return state;
  }
}

export function userInfo(state = {
  first_name: '',
  last_name: '',
  photo_100: '',
  isInvited: false,
  participantBattleID: '',

  GP: {
    today: 0,
    overall: 0,
  },
  GPgrowth: 0,
  coins: {
    today: 0,
    overall: 0,
  },
  confirmReward: {
    bp: 0,
    coins: 0,
  },
  storiesCount: {
    today: 0,
    overall: 0,
  },

  tax: 0,
  friendsPlace: 1,
  worldPlace: 1,
  date: 0,
  isExamAvailable: false,
  isExamSuccess: false,
  isStoryConfirmed: false,
  effects: [],
  isPioneer: false,
  isMaster: false,
  selectedQuestionsCategory: {
    questions: [],
    category: 'All',
  },
  selectedTab: '',
  leads: [],
  msToNextExam: {
    value: 0,
    isUpdating: false,
  },
  notifications: [],
}, action) {
  switch (action.type) {
    case 'UPDATE_USER_INFO':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function myBattle(state = {
  pid: '',
  allFilms: [],
  myFilms: [],
  members: [],
  settings: {
    name: '[Название]',
    limit: 3,
    type: 0,
    numberOfWinners: 1,
    allowDuplicates: false,
  },
}, action) {
  switch (action.type) {
    case 'UPDATE_MY_BATTLE':
      return {...state, ...action.payload};
    default: return state;
  }
}

export function notificationsAllow(state = { isAllow: false }, action) {
  switch (action.type) {
    case 'UPDATE_NOTIFICATIONS_ALLOW':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function userQuestions(state = {
  questions: {
    All: [],
    Math: [],
    Russian: [],
    Literature: [],
    Physics: [],
    Chemistry: [],
    Astronomy: [],
    Biology: [],
    History: [],
    Art: [],
    Sport: [],
    Geography: [],
    Other: [],
  },
  selectedQuestionsCategory: [],
  category: 'All',
  unapprovedQuestions: 0,
  categoriesHorizontalScroll: 0,
}, action) {
  switch (action.type) {
    case 'UPDATE_USER_QUESTIONS':
      return { ...state, ...action.payload };
    case 'UPDATE_USER_QUESTION_CATEGORY':
      return {
        ...state,
        selectedQuestionsCategory: state.questions[action.payload.category],
        category: action.payload.category,
        categoriesHorizontalScroll: action.payload.categoriesHorizontalScroll || 0,
      };
    case 'RESET_SELECTED_CATEGORY':
      return {
        ...state,
        selectedQuestionsCategory: [],
        category: 'All',
      };
    default:
      return state;
  }
}

export function mainViewModal(state = { modalName: null }, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        modalName: action.payload,
      };
    default:
      return state;
  }
}

export function workViewModal(state = {
  modalIsActive: false,
  questionsLength: 0,
  start: false,
  isStartModal: true,
}, action) {
  switch (action.type) {
    case 'UPDATE_WORK-VIEW-MODAL':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export function userToken(state = { token: '', friendsAccessToken: '' }, action) {
  switch (action.type) {
    case 'UPDATE_TOKEN':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function pageCache(state = { shop: [] }, action) {
  switch (action.type) {
    case 'PAGE_CACHE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function tooltip(state = {
  mainScreenComplete: false,
  story1: {
    balance: true,
    quizBlock: false,
    taxEffect: false,
  },
  story2: {
    GPeffect: false,
    GPeffectCompleted: false,
    notifications: false,
  },
  shop: true,
}, action) {
  function updateVKStorage(data) {
    bridge.send('VKWebAppStorageSet', {
      key: globalVariables.tooltips,
      value: JSON.stringify(data),
    });
  }
  switch (action.type) {
    case 'TOOLTIP_UPDATE': {
      updateVKStorage({ ...state, ...action.payload });
      return {
        ...state,
        ...action.payload,
      };
    }

    case 'TOOLTIP_UPDATE_STORY1': {
      const story1 = { ...state.story1, ...action.payload };
      updateVKStorage({ ...state, story1 });
      return {
        ...state,
        story1,
      };
    }
    case 'TOOLTIP_UPDATE_STORY2': {
      const story2 = { ...state.story2, ...action.payload };
      updateVKStorage({ ...state, story2 });
      return {
        ...state,
        story2,
      };
    }
    default:
      return state;
  }
}

export function shopQuestion(state = {
  question: {
    text: '',
    answers: ['', '', '', ''],
    explanation: '',
    category: '',
    correctAnswer: 0,
    cost: 0,
  },
}, action) {
  switch (action.type) {
    case 'UPDATE_SHOP_QUESTION':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function scrollTo(state = {
  activeStory: '',
  scrollableElement: '',
  top: 0,
}, action) {
  switch (action.type) {
    case 'SCROLL_TO':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function mainSnackbar(state = {
  showSnackbar: false,
  text: '',
}, action) {
  switch (action.type) {
    case 'UPDATE_MAIN_SNACKBAR':
      return { ...state, ...action.payload };
    default: return state;
  }
}
