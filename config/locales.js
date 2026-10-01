module.exports = {
  defaultLanguage: 'ar',
  ar: {
    botName: 'Blue Lock Bot',
    commands: {
      help: 'الأوامر المتاحة',
      chooseCharacter: 'اختيار الشخصية',
      profile: 'الملف الشخصي',
      debugDb: 'تشخيص قاعدة البيانات'
    },
    help: {
      title: 'أوامر البوت',
      description: 'البوت يدعم نظام اللاعب الفردي (Mode 1) وجمع الشخصيات (Mode 2).',
      commands: [
        '/help - عرض الأوامر المتاحة',
        '/choose-character - اختيار شخصية اللاعب الشخصية الأساسية',
        '/profile - عرض الملف الشخصي للاعب',
        '/debug-db - فحص قاعدة البيانات (للمشرفين فقط)'
      ]
    },
    errors: {
      commandFailed: 'حدث خطأ أثناء تنفيذ الأمر. يرجى المحاولة مرة أخرى.',
      missingCharacterFile: 'ملف بيانات الشخصيات غير موجود أو فارغ. أضف ملف blue_lock_characters.json الصالح قبل التشغيل.',
      invalidCharacterId: 'معرف الشخصية غير صالح.',
      duplicateClaim: 'هذه الشخصية مملوكة بالفعل من قبل مستخدم آخر.',
      missingPermissions: 'لا أملك صلاحيات كافية لإدارة أدوار Discord.',
      duplicateRole: 'الدور موجود بالفعل.',
      profileMissing: 'لم يتم اختيار شخصية بعد لهذا المستخدم.'
    }
  },
  en: {
    botName: 'Blue Lock Bot',
    commands: {
      help: 'Available commands',
      chooseCharacter: 'Choose character',
      profile: 'Profile',
      debugDb: 'Database debug'
    },
    help: {
      title: 'Bot commands',
      description: 'The bot supports Mode 1 personal characters and Mode 2 collection systems.',
      commands: [
        '/help - Show available commands',
        '/choose-character - Choose the player character',
        '/profile - Show the player profile',
        '/debug-db - Inspect database state (admin only)'
      ]
    },
    errors: {
      commandFailed: 'An error occurred while executing the command. Please try again.',
      missingCharacterFile: 'The character database file is missing or empty. Add a valid blue_lock_characters.json file before starting the bot.',
      invalidCharacterId: 'The character ID is invalid.',
      duplicateClaim: 'This character is already owned by another member.',
      missingPermissions: 'I do not have enough permissions to manage Discord roles.',
      duplicateRole: 'The role already exists.',
      profileMissing: 'This user has not selected a character yet.'
    }
  }
};
