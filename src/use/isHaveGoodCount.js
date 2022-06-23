export default function isHaveGoodCount (count, price) {
  return count > 0 ? price + " ₽" : "Товар закончился";
}
