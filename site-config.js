const descriptionMd = `Sales Portal`

const description = descriptionMd
  .replace(/\[([^\]]+)\](\([^)]+\)|\[[^\]]+\])/g, '$1')
  .replace(/\n/g, '')
  .replace(/\s{2,}/g, ' ')
  .trim()

module.exports = {
  title: 'Devtown Sales Portal',
  descriptionMd,
  description,
  url: 'https://www.seongland.com',
  twitterUsername: '@shapeai',
  email: 'shape',
  socials: {
    GitHub: '',
    Twitter: '',
  },
  bgColor: '#1A202C',
  themeColor: '#46c0aE',
}
