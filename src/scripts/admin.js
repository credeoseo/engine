import CMS from 'netlify-cms'
import { repoName } from '/src/theme/admin.js'

export default new class  {
  constructor() {
    this.handler();
  }

  handler() {
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
					{
						"name": "index",
						"label": "Контактная информация",
						"file": "/data/contacts.json",
						"widget" : "list",
						"fields": [
							{
								"label": "Телефон",
								"name": "phone",
								"widget": "string"
							},
							{
								"label": "Почта",
								"name": "mail",
								"widget": "string"
							},
							{
								"label": "WhatsApp",
								"name": "wa",
								"widget": "string"
							},
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
				]
			}
		]
	}
    CMS.init({config})
  }
}

