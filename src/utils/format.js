export function formatLabCode(id) {
  if (id === null || id === undefined || id === '') {
    return ''
  }
  return `LAB${String(id).padStart(3, '0')}`
}
