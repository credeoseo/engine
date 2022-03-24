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
		"widget": "string"
	}
	const mail = {
		"label": "Почта",
		"name": "mail",
		"widget": "string"
	}
	const wa = {
		"label": "WhatsApp",
		"name": "wa",
		"widget": "string"
	}
	const addresses = {
		"name": "addresses",
		"label": "Адреса",
		"widget" : "list",
		"fields": [
			{
				"label": "Адрес",
				"name": "address",
				"widget": "string"
			},
			{
				"label": "Карта",
				"name": "mapLink",
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
				"widget": "string"
			},
			{
				"name": "logoUrl",
				"label": "Логотип",
				"widget": "image"
			},
			{
				"name": "faviconUrl",
				"label": "Фавиконка",
				"widget": "image"
			},
			{
				"name": "department",
				"label": "Отдел",
				"widget": "string"
			},
			{
				"name": "wmid",
				"label": "WMID",
				"widget": "string"
			},
			{
				"name": "city",
				"label": "Город",
				"widget": "string"
			},
			{
				"name": "api",
				"label": "Ссылка на API",
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
				"widget": "string"
			},
			{
				"name": "broker_id",
				"label": "Брокер",
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

