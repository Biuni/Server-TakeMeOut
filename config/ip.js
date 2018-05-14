const ip = exports
const os = require('os')

const _normalizeFamily = family => {
  return family ? family.toLowerCase() : 'ipv4'
}

ip.address = (name, family) => {
  const interfaces = os.networkInterfaces()

  family = _normalizeFamily(family)

  if (name && name !== 'private' && name !== 'public') {
    const res = interfaces[name].filter(details => {
      const itemFamily = details.family.toLowerCase()
      return itemFamily === family
    })
    if (res.length === 0) { return undefined }
    return res[0].address
  }

  const all = Object.keys(interfaces).map(nic => {
    const addresses = interfaces[nic].filter(details => {
      details.family = details.family.toLowerCase()
      if (details.family !== family || ip.isLoopback(details.address) || ip.isVirtual(nic)) {
        return false
      } else if (!name) {
        return true
      }

      return name === 'public' ? ip.isPrivate(details.address)
        : ip.isPublic(details.address)
    })

    return addresses.length ? addresses[0].address : undefined
  }).filter(Boolean)

  return !all.length ? ip.loopback(family) : all[0]
}

ip.loopback = family => {
  family = _normalizeFamily(family)

  if (family !== 'ipv4' && family !== 'ipv6') {
    throw new Error('Family must be ipv4 or ipv6')
  }

  return family === 'ipv4' ? '127.0.0.1' : 'fe80::1'
}

ip.isLoopback = addr => {
  return /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/
    .test(addr) ||
    /^fe80::1$/.test(addr) ||
    /^::1$/.test(addr) ||
    /^::$/.test(addr)
}

ip.isVirtual = nic => /VirtualBox/.test(nic)

ip.isPrivate = addr => {
  return /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i
    .test(addr) ||
    /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i
      .test(addr) ||
    /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^f[cd][0-9a-f]{2}:/i.test(addr) ||
    /^fe80:/i.test(addr) ||
    /^::1$/.test(addr) ||
    /^::$/.test(addr)
}

ip.isPublic = addr => !ip.isPrivate(addr)
