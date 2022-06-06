const isHaveGood = (count, price) => {
  return count > 0 ? price + ' ₽' : 'Товар закончился';
}

export default isHaveGood;
