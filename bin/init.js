// const readline = require('readline');
const fs = require('fs')
const path = require('path')
const colors = require('colors')
const inquirer = require('inquirer');
const config = require('./config.json');
const execSync = require('child_process').execSync;

module.exports =  async () => {
    const { platform } = await inquirer.prompt([{
        name: 'platform',
        type: 'list',
        message: `选择游戏运行的平台:`,
        choices: [
          { name: '微信小游戏', value: 'wxgame' },
          { name: 'HTML5', value: 'h5' },
        ]
    }])

    const { projectName } = await inquirer.prompt([{
        name: 'projectName',
        type: 'input',
        message: `请输入游戏项目名称:`,
    }])

    const { description } = await inquirer.prompt([{
        name: 'description',
        type: 'input',
        message: `请输入游戏描述:`,
    }])

    const { author } = await inquirer.prompt([{
        name: 'author',
        type: 'input',
        message: `请输入项目作者:`,
    }])

    const git = config[platform].git

    if (!git) {
        console.log(colors.red('init wrong, plaese try again. \n '))
        process.exit()
    }

    console.log(colors.green('\n ⌛️ Waiting... \n'))
    
    const gitCommand = `git clone -b master ${git} ${projectName}`

    if (execSync(gitCommand)) {
        const packages = require(path.resolve(process.cwd(), projectName, 'package.json'))
        execSync(`rm -rf ./${projectName}/.git ./${projectName}/package.json`)
        packageJSONUpdate(packages, projectName, description, author)
        console.log(colors.green('\n✨  create completed! \n'))
        console.log(colors.green(`\n✨ please cd ${projectName} && npm i \n`))
    } else {
        console.log(colors.red('\n × git clone failure! \n '))
    }

    process.exit()
}

function camelize(string) {
    if (typeof string !== 'string') return console.warn('you can only camelize a string.')
    return string.replace(/[_.-](\w|$)/g, (match, $) => $.toUpperCase())
}

function getName(name) {
    if (name.startsWith('@') && name.includes('/')) {
        return name.split('/')[1]
    }
    return name
}

function packageJSONUpdate(packages, name, description, author) {
    packages.name = name || 'game'
    packages.description = description || ''
    packages.author = author || ''
    packages.moduleName = camelize(getName(name))
    packages.main = `dist/${getName(name)}.js`
    packages.module = `dist/${getName(name)}.es.js`
    
    try {
        fs.writeFileSync(`${process.cwd()}/${name}/package.json`, JSON.stringify(packages, null, '  '), 'utf-8')
    } catch (error) {
        console.log(error)
    }
}
