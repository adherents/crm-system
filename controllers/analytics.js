const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async function(req, res) {
  try {
    const allOrders = await Order.find({user: req.user.id}).sort(1)
    const ordersMap = getOrdersMap(allOrders)
    const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || []

    // Количество заказов
    const ordersAmount = allOrders.length
    // Количество заказов вчера
    const yesterdayOrdersAmount = yesterdayOrders.length
    // Количество дней
    const daysAmount = Object.keys(ordersMap).length
    // Количество заказов в день
    const ordersPerDay = (ordersAmount / daysAmount).toFixed(0)
    // ((заказов вчера / кол-во в день) - 1) * 100
    // Процент для количества заказов
    const ordersPercent = (((yesterdayOrdersAmount / ordersPerDay) - 1) * 100).toFixed(2)
    // Общая выручка
    const totalGain = calculatePrice(allOrders)
    // Выручка в день
    const gainPerDay = totalGain / daysAmount
    // Выручка за вчера
    const yesterdayGain = calculatePrice(yesterdayOrders)
    // Процент выручки
     const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2)
    // Сравнение выручки
    const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
    // Сравнение кол-ва заказов
    const compareOrdersAmount = (yesterdayOrdersAmount - ordersPerDay).toFixed(2)

    res.status(200).json({
      gain: {
        percent: Math.abs(+gainPercent),
        compare: Math.abs(+compareGain),
        yesterday: +yesterdayGain,
        isHigher: +gainPercent > 0
      },
      orders: {
        percent: Math.abs(+ordersPercent),
        compare: Math.abs(+compareOrdersAmount),
        yesterday: +yesterdayOrdersAmount,
        isHigher: +ordersPercent > 0
      }
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

module.exports.analytics = function(req, res) {

}

function getOrdersMap(orders = []) {
  const daysOrders = {}
  orders.forEach(order => {
    const date = moment(order.date).format('DD.MM.YYYY')
    if (date === moment().format('DD.MM.YYYY')) {
      return
    }
    if (!daysOrders[date]) {
      daysOrders[date] = []
    }
    daysOrders[date].push(order)
  })
  return daysOrders
}

function calculatePrice(orders = []) {
  return orders.reduce((total, order) => {
    const orderPrice = order.list.reduce((orderTotal, item) => {
      return orderTotal += item.cost * item.quantity
    }, 0)
    return total += orderPrice
  }, 0)
}
