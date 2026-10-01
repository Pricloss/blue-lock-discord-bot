function getCurrentMissions() {
  return [
    {
      id: 'mission_welcome',
      title: 'مهمة ترحيب',
      description: 'ابدأ بتحديد شخصيتك في وضع اللاعب الفردي.',
      reward: 'عملة افتراضية مقدمة لإضافة النظام لاحقًا.'
    },
    {
      id: 'mission_collection',
      title: 'مهمة المجموعة',
      description: 'احصل على شخصية جديدة في نظام المجموعة.',
      reward: 'مكافأة مستقبلية في نظام الحشد.'
    }
  ];
}

module.exports = { getCurrentMissions };
