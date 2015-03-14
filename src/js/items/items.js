function Item(maxHPBonus, hpRegenBonus, maxMPBonus, mpRegenBonus, attackBonus, defenceBonus) {
  this.maxHPBonus = maxHPBonus;
  this.hpRegenBonus = hpRegenBonus;
  this.maxMPBonus = maxMPBonus;
  this.mpRegenBonus = mpRegenBonus;
  this.attackBonus = attackBonus;
  this.defenceBonus = defenceBonus;
}

Item.prototype.getMaxHPBonus = function() {
  return this.maxHPBonus;
}

Item.prototype.getHPRegenBonus = function() {
  return this.hpRegenBonus;
}

Item.prototype.getMaxMPBonus = function() {
  return this.maxMPBonus;
}

Item.prototype.getMPRegenBonus = function() {
  return this.mpRegenBonus;
}

Item.prototype.getAttackBonus = function() {
  return this.attackBonus;
}

Item.prototype.getDefenceBonus = function() {
  return this.defenceBonus;
}

Item.prototype.use = function() {

}

// Longbow

Longbow.prototype = Object.create(Item.prototype);

function Longbow() {
  Item.call(this, 0, 0, 0, 0, 0, 0);
}

Longbow.prototype.use = function() {
  me.game.world.addChild(me.pool.pull("arrow", source.x, source.y, {}), 0);
}
