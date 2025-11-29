export type Language = 'vi' | 'en'

export interface Translations {
  // Common
  common: {
    save: string
    cancel: string
    delete: string
    edit: string
    add: string
    close: string
    loading: string
    today: string
  }
  
  // Header
  header: {
    nutrichat: string
    aiNutritionAssistant: string
    dashboard: string
    selectDate: string
    shareProfile: string
    logout: string
    login: string
    loginWithGoogle: string
    guestMode: string
  }

  // Chat
  chat: {
    welcome: string
    welcomeSubtitle: string
    sendMessage: string
    cannotSendMessage: string
    errorOccurred: string
    placeholder: string
    history: string
    noHistory: string
    you: string
    ai: string
    yesterday: string
    newChat: string
    newChatCreated: string
    message: string
    messages: string
  }

  // Dashboard
  dashboard: {
    foodLog: string
    addFood: string
    updateSuccess: string
    updateFailed: string
    deleteSuccess: string
    deleteFailed: string
    addSuccess: string
    addFailed: string
    shareLinkCopied: string
    cannotCopyLink: string
    loginSuccess: string
    loginFailed: string
    logoutSuccess: string
    logoutFailed: string
    cannotLoadData: string
  }

  // Health Metrics
  health: {
    title: string
    noData: string
    addInfo: string
    updateInfo: string
    height: string
    heightLabel: string
    weight: string
    weightLabel: string
    gender: string
    selectGender: string
    male: string
    female: string
    other: string
    bmi: string
    bmr: string
    idealWeight: string
    underweight: string
    normal: string
    overweight: string
    obese1: string
    obese2: string
    needGainWeight: string
    weightGood: string
    shouldLoseWeight: string
    needLoseWeight: string
    heightUnit: string
    weightUnit: string
    heightRange: string
    weightRange: string
    updateSuccess: string
    updateFailed: string
    basicMetabolicRate: string
  }

  // Calendar
  calendar: {
    months: string[]
    days: string[]
  }

  // Food
  food: {
    calories: string
    protein: string
    carbs: string
    fat: string
    ingredients: string
    eatThis: string
    loggedSuccess: string
    loggedFailed: string
  }
}

export const translations: Record<Language, Translations> = {
  vi: {
    common: {
      save: 'Lưu',
      cancel: 'Hủy',
      delete: 'Xóa',
      edit: 'Sửa',
      add: 'Thêm',
      close: 'Đóng',
      loading: 'Đang tải...',
      today: 'Hôm nay',
    },
    header: {
      nutrichat: 'NutriChat',
      aiNutritionAssistant: 'AI Nutrition Assistant',
      dashboard: 'Dashboard',
      selectDate: 'Chọn ngày',
      shareProfile: 'Chia sẻ hồ sơ',
      logout: 'Đăng xuất',
      login: 'Đăng nhập',
      loginWithGoogle: 'Đăng nhập với Google',
      guestMode: 'Guest Mode',
    },
    chat: {
      welcome: 'Chào mừng đến với NutriChat!',
      welcomeSubtitle: 'Hãy hỏi tôi về món ăn bạn muốn ăn hôm nay',
      sendMessage: 'Gửi tin nhắn',
      cannotSendMessage: 'Không thể gửi tin nhắn. Vui lòng thử lại.',
      errorOccurred: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
      placeholder: 'Nhập tin nhắn...',
      history: 'Lịch sử chat',
      noHistory: 'Chưa có lịch sử chat',
      you: 'Bạn',
      ai: 'AI',
      yesterday: 'Hôm qua',
      newChat: 'Chat mới',
      newChatCreated: 'Đã tạo cuộc trò chuyện mới',
      message: 'tin nhắn',
      messages: 'tin nhắn',
    },
    dashboard: {
      foodLog: 'Nhật ký ăn uống',
      addFood: 'Thêm món',
      updateSuccess: 'Cập nhật thành công',
      updateFailed: 'Cập nhật thất bại',
      deleteSuccess: 'Xóa thành công',
      deleteFailed: 'Xóa thất bại',
      addSuccess: 'Thêm món ăn thành công',
      addFailed: 'Thêm thất bại',
      shareLinkCopied: 'Đã sao chép link chia sẻ!',
      cannotCopyLink: 'Không thể sao chép link',
      loginSuccess: 'Đăng nhập thành công',
      loginFailed: 'Đăng nhập thất bại',
      logoutSuccess: 'Đã đăng xuất',
      logoutFailed: 'Đăng xuất thất bại',
      cannotLoadData: 'Không thể tải dữ liệu',
    },
    health: {
      title: 'Chỉ số sức khỏe',
      noData: 'Chưa có thông tin sức khỏe',
      addInfo: 'Thêm thông tin',
      updateInfo: 'Cập nhật thông tin sức khỏe',
      height: 'Chiều cao (cm)',
      heightLabel: 'Chiều cao',
      weight: 'Cân nặng (kg)',
      weightLabel: 'Cân nặng',
      gender: 'Giới tính',
      selectGender: 'Chọn giới tính',
      male: 'Nam',
      female: 'Nữ',
      other: 'Khác',
      bmi: 'Chỉ số BMI',
      bmr: 'BMR',
      idealWeight: 'Cân nặng lý tưởng',
      underweight: 'Thiếu cân',
      normal: 'Bình thường',
      overweight: 'Thừa cân',
      obese1: 'Béo phì độ I',
      obese2: 'Béo phì độ II',
      needGainWeight: 'Cần tăng cân',
      weightGood: 'Cân nặng tốt',
      shouldLoseWeight: 'Nên giảm cân nhẹ',
      needLoseWeight: 'Cần giảm cân',
      heightUnit: 'cm',
      weightUnit: 'kg',
      heightRange: 'Chiều cao phải từ 50-250 cm',
      weightRange: 'Cân nặng phải từ 20-300 kg',
      updateSuccess: 'Đã cập nhật thông tin sức khỏe',
      updateFailed: 'Không thể lưu thông tin sức khỏe',
      basicMetabolicRate: 'Tỷ lệ trao đổi chất cơ bản',
    },
    calendar: {
      months: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ],
      days: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    },
    food: {
      calories: 'kcal',
      protein: 'Protein',
      carbs: 'Carbs',
      fat: 'Fat',
      ingredients: 'Nguyên liệu',
      eatThis: 'Ăn món này',
      loggedSuccess: 'Đã thêm "{name}" vào nhật ký của bạn!',
      loggedFailed: 'Không thể lưu món ăn. Vui lòng thử lại.',
    },
  },
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      close: 'Close',
      loading: 'Loading...',
      today: 'Today',
    },
    header: {
      nutrichat: 'NutriChat',
      aiNutritionAssistant: 'AI Nutrition Assistant',
      dashboard: 'Dashboard',
      selectDate: 'Select Date',
      shareProfile: 'Share Profile',
      logout: 'Logout',
      login: 'Login',
      loginWithGoogle: 'Login with Google',
      guestMode: 'Guest Mode',
    },
    chat: {
      welcome: 'Welcome to NutriChat!',
      welcomeSubtitle: 'Ask me about what you want to eat today',
      sendMessage: 'Send message',
      cannotSendMessage: 'Cannot send message. Please try again.',
      errorOccurred: 'Sorry, an error occurred. Please try again.',
      placeholder: 'Type a message...',
      history: 'Chat History',
      noHistory: 'No chat history',
      you: 'You',
      ai: 'AI',
      yesterday: 'Yesterday',
      newChat: 'New Chat',
      newChatCreated: 'New conversation created',
      message: 'message',
      messages: 'messages',
    },
    dashboard: {
      foodLog: 'Food Log',
      addFood: 'Add Food',
      updateSuccess: 'Updated successfully',
      updateFailed: 'Update failed',
      deleteSuccess: 'Deleted successfully',
      deleteFailed: 'Delete failed',
      addSuccess: 'Food added successfully',
      addFailed: 'Add failed',
      shareLinkCopied: 'Share link copied!',
      cannotCopyLink: 'Cannot copy link',
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      logoutSuccess: 'Logged out',
      logoutFailed: 'Logout failed',
      cannotLoadData: 'Cannot load data',
    },
    health: {
      title: 'Health Metrics',
      noData: 'No health information',
      addInfo: 'Add Information',
      updateInfo: 'Update Health Information',
      height: 'Height (cm)',
      heightLabel: 'Height',
      weight: 'Weight (kg)',
      weightLabel: 'Weight',
      gender: 'Gender',
      selectGender: 'Select Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      bmi: 'BMI',
      bmr: 'BMR',
      idealWeight: 'Ideal Weight',
      underweight: 'Underweight',
      normal: 'Normal',
      overweight: 'Overweight',
      obese1: 'Obese Class I',
      obese2: 'Obese Class II',
      needGainWeight: 'Need to gain weight',
      weightGood: 'Weight is good',
      shouldLoseWeight: 'Should lose weight slightly',
      needLoseWeight: 'Need to lose weight',
      heightUnit: 'cm',
      weightUnit: 'kg',
      heightRange: 'Height must be between 50-250 cm',
      weightRange: 'Weight must be between 20-300 kg',
      updateSuccess: 'Health information updated',
      updateFailed: 'Cannot save health information',
      basicMetabolicRate: 'Basal Metabolic Rate',
    },
    calendar: {
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    food: {
      calories: 'kcal',
      protein: 'Protein',
      carbs: 'Carbs',
      fat: 'Fat',
      ingredients: 'Ingredients',
      eatThis: 'Eat This',
      loggedSuccess: 'Added "{name}" to your log!',
      loggedFailed: 'Cannot save food. Please try again.',
    },
  },
}

