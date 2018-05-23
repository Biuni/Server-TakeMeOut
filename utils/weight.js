module.exports = (people, LOS, V, R, K, L, pv, pr, pk, pl) => {
  const pLOS = (people >= LOS) ? 1000 : 0
  return pLOS + pv * V + pr * R + pk * K + pl * L
}
