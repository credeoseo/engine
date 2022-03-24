import CMS from 'netlify-cms'
import { repoName } from '/src/theme/admin.js'

export default new class  {
  constructor() {
    this.handler();
  }

  handler() {
	const phone = {
		"label": "Телефон",
		"name": "phone",
		"required": false,
		"widget": "string"
	}
	const mail = {
		"label": "Почта",
		"name": "mail",
		"required": false,
		"widget": "string"
	}
	const wa = {
		"label": "WhatsApp",
		"name": "wa",
		"required": false,
		"widget": "string"
	}
	const addresses = {
		"name": "addresses",
		"label": "Адреса",
		"widget" : "list",
		"required": false,
		"fields": [
			{
				"label": "Адрес",
				"name": "address",
				"required": false,
				"widget": "string"
			},
			{
				"label": "Карта",
				"name": "mapLink",
				"required": false,
				"widget": "string"
			}
		]
	}
	const contacts = {
		"name": "index",
		"label": "Контактная информация",
		"file": "/data/contacts.json",
		"widget" : "list",
		"editor": {
			"preview": false,
		},
		"fields": [
			phone,
			mail,
			wa,
			addresses,
			{
				"name": "aliases",
				"widget": "list",
				"required": false,
				"fields": [
					{
						"name": "alias",
						"label": "Алиас",
						"widget": "string"
					},
					phone,
					mail,
					wa,
					addresses,
				]
			}
		]
	}
	const settings = {
		"name": "menu",
		"label": "Настройки сайта",
		"file": "/data/site.json",
		"widget" : "list",
		"editor": {
			"preview": false,
		},
		"fields": [
			{
				"name": "name",
				"label": "Название",
				"required": false,
				"widget": "string"
			},
			{
				"name": "logoUrl",
				"label": "Логотип",
				"required": false,
				"widget": "image"
			},
			{
				"name": "faviconUrl",
				"label": "Фавиконка",
				"required": false,
				"widget": "image"
			},
			{
				"name": "department",
				"label": "Отдел",
				"required": false,
				"widget": "string"
			},
			{
				"name": "wmid",
				"label": "WMID",
				"required": false,
				"widget": "string"
			},
			{
				"name": "city",
				"label": "Город",
				"required": false,
				"widget": "string"
			},
			{
				"name": "api",
				"label": "Ссылка на API",
				"required": false,
				"widget": "string"
			},
			{
				"name": "credeoApi",
				"label": "Credeo API?",
				"widget": "boolean",
				"default": true
			},
			{
				"name": "source_id",
				"label": "Источник",
				"required": false,
				"widget": "string"
			},
			{
				"name": "broker_id",
				"label": "Брокер",
				"required": false,
				"widget": "string"
			},
		]
	}

	const config = {
		"backend": {
			name: "github",
			repo: repoName,
			branch: "main",
			base_url : "https://natcredit.ru"
		},
		load_config_file: false,
		"media_folder": "/img",
		"collections": [
			{
				"label": 'Данные',
				"name": 'lists',
				"files": [
					contacts,
					settings
				]
			}
		]
	}
    CMS.init({config})
  }
}

