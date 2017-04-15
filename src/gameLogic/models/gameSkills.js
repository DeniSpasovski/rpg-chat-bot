function gameSkills(skills) {
    this.energy = skills.energy || 100;
    this.maxEnergy = skills.energy || 100;
    this.attack = skills.attack || 10;
    this.attackSkill = skills.attackSkill || 0.1;
    this.defense = skills.defense || 10;
    this.defenseSkill = skills.defenseSkill || 0.1;
    return this;
}

module.exports = gameSkills;