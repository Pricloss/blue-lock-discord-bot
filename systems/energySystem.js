function calculateEnergyAfterActivity(currentEnergy, activityIntensity, conditionModifier = 1) {
  const nextEnergy = currentEnergy - (activityIntensity * 2 * conditionModifier);
  return Math.max(0, Math.min(100, nextEnergy));
}

function recoverEnergy(currentEnergy, minutesSinceLastAction, recoveryRate = 3) {
  const recovered = currentEnergy + (minutesSinceLastAction * recoveryRate);
  return Math.max(0, Math.min(100, recovered));
}

module.exports = {
  calculateEnergyAfterActivity,
  recoverEnergy
};
