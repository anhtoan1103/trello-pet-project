// Sort Columns/Cards
export const mapOrder = (originalArray, orderArray, key) => {
  if (!originalArray || !orderArray || !key) return []

  const clonedArray = [...originalArray]
   let orderedArray = clonedArray.sort((a,b) => {
    return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key])
  })
  return orderedArray
}