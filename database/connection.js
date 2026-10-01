function getCurrentMissions() {
  return [
    {
      id: 'mission_welcome',
      title: 'مهمة ترحيب',
      description: 'المهمة الأساسية الأولى: ابدأ بإنشاء ملفك الشخصي.',
      reward: 'عملة افتراضية + نقطة تقدم'
    },
    {
      id: 'mission_match_play',
      title: 'مهمة مباراة',
      description: 'العب مباراة ودعم نظام الطاقة والتقدم المستقبلي.',
      reward: 'مكافأة افتراضية مستقبلية'
    }
  ];
}

module.exports = {
  getCurrentMissions
};
