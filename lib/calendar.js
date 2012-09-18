
/**
 * Module dependencies.
 */

var o = require('jquery')
  , Emitter = require('emitter')
  , template = require('./template')
  , Days = require('./days')
  , clamp = require('./utils').clamp;

/**
 * Expose `Calendar`.
 */

module.exports = Calendar;

/**
 * Initialize a new `Calendar`
 * with the given `date` defaulting
 * to now.
 *
 * Events:
 *
 *  - `prev` when the prev link is clicked
 *  - `next` when the next link is clicked
 *  - `change` (date) when the selected date is modified
 *
 * @params {Date} date
 * @api public
 */

function Calendar(date) {
  Emitter.call(this);
  var self = this;
  this.el = o('<div class=calendar></div>');
  this.days = new Days;
  this.el.append(this.days.el);
  this.on('change', this.show.bind(this));
  this.days.on('prev', this.prev.bind(this));
  this.days.on('next', this.next.bind(this));
  this.show(date || new Date);
  this.days.on('change', function(date){
    self.emit('change', date);
  });
}

/**
 * Mixin emitter.
 */

Emitter(Calendar.prototype);

/**
 * Add class `name` to differentiate this
 * specific calendar for styling purposes,
 * for example `calendar.addClass('date-picker')`.
 *
 * @param {String} name
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.addClass = function(name){
  this.el.addClass(name);
  return this;
};

/**
 * Select `date`.
 *
 * @param {Date} date
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.select = function(date){
  this.selected = date;
  this.days.select(date);
  this.show(date);
  return this;
};

/**
 * Show `date`.
 *
 * @param {Date} date
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.show = function(date){
  this._date = date;
  this.days.show(date);
  return this;
};

/**
 * Return the previous month.
 *
 * @return {Date}
 * @api private
 */

Calendar.prototype.prevMonth = function(){
  var date = new Date(this._date);
  date.setMonth(date.getMonth() - 1);
  return date;
};

/**
 * Return the next month.
 *
 * @return {Date}
 * @api private
 */

Calendar.prototype.nextMonth = function(){
  var date = new Date(this._date);
  date.setMonth(date.getMonth() + 1);
  return date;
};

/**
 * Show the prev view.
 *
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.prev = function(){
  this.show(this.prevMonth());
  this.emit('prev');
  return this;
};

/**
 * Show the next view.
 *
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.next = function(){
  this.show(this.nextMonth());
  this.emit('next');
  return this;
};