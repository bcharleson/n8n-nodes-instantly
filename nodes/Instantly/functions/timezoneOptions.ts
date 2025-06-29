/**
 * Shared timezone options for Instantly API v2 campaigns
 * These values match the exact enum values expected by the API
 */

export interface ITimezoneOption {
	name: string;
	value: string;
}

export const TIMEZONE_OPTIONS: ITimezoneOption[] = [
	// GMT Offsets
	{ name: 'GMT+12', value: 'Etc/GMT+12' },
	{ name: 'GMT+11', value: 'Etc/GMT+11' },
	{ name: 'GMT+10', value: 'Etc/GMT+10' },
	{ name: 'GMT-12', value: 'Etc/GMT-12' },
	{ name: 'GMT-13', value: 'Etc/GMT-13' },

	// Americas
	{ name: 'Alaska (Anchorage)', value: 'America/Anchorage' },
	{ name: 'Canada (Dawson)', value: 'America/Dawson' },
	{ name: 'Canada (Creston)', value: 'America/Creston' },
	{ name: 'Mexico (Chihuahua)', value: 'America/Chihuahua' },
	{ name: 'US Mountain (Boise)', value: 'America/Boise' },
	{ name: 'Belize', value: 'America/Belize' },
	{ name: 'US Central (Chicago)', value: 'America/Chicago' },
	{ name: 'Mexico (Bahia Banderas)', value: 'America/Bahia_Banderas' },
	{ name: 'Canada (Regina)', value: 'America/Regina' },
	{ name: 'Colombia (Bogota)', value: 'America/Bogota' },
	{ name: 'US Eastern (Detroit)', value: 'America/Detroit' },
	{ name: 'US Eastern (Indiana/Marengo)', value: 'America/Indiana/Marengo' },
	{ name: 'Venezuela (Caracas)', value: 'America/Caracas' },
	{ name: 'Paraguay (Asuncion)', value: 'America/Asuncion' },
	{ name: 'Canada Atlantic (Glace Bay)', value: 'America/Glace_Bay' },
	{ name: 'Brazil (Cuiaba)', value: 'America/Cuiaba' },
	{ name: 'Brazil (Campo Grande)', value: 'America/Campo_Grande' },
	{ name: 'Brazil (Sao Paulo)', value: 'America/Sao_Paulo' },
	{ name: 'Argentina (Buenos Aires)', value: 'America/Argentina/Buenos_Aires' },
	{ name: 'Uruguay (Montevideo)', value: 'America/Montevideo' },
	{ name: 'Chile (Santiago)', value: 'America/Santiago' },
	{ name: 'Brazil (Noronha)', value: 'America/Noronha' },
	{ name: 'Greenland (Godthab)', value: 'America/Godthab' },
	{ name: 'Cape Verde', value: 'Atlantic/Cape_Verde' },

	// Europe
	{ name: 'UK (Isle of Man)', value: 'Europe/Isle_of_Man' },
	{ name: 'Norway (Longyearbyen)', value: 'Arctic/Longyearbyen' },
	{ name: 'Serbia (Belgrade)', value: 'Europe/Belgrade' },
	{ name: 'Bosnia (Sarajevo)', value: 'Europe/Sarajevo' },
	{ name: 'Finland (Helsinki)', value: 'Europe/Helsinki' },
	{ name: 'Turkey (Istanbul)', value: 'Europe/Istanbul' },
	{ name: 'Romania (Bucharest)', value: 'Europe/Bucharest' },
	{ name: 'Russia (Kaliningrad)', value: 'Europe/Kaliningrad' },
	{ name: 'Russia (Kirov)', value: 'Europe/Kirov' },
	{ name: 'Russia (Astrakhan)', value: 'Europe/Astrakhan' },

	// Africa
	{ name: 'Morocco (Casablanca)', value: 'Africa/Casablanca' },
	{ name: 'West Africa (Abidjan)', value: 'Africa/Abidjan' },
	{ name: 'Spain (Ceuta)', value: 'Africa/Ceuta' },
	{ name: 'Algeria', value: 'Africa/Algiers' },
	{ name: 'Namibia (Windhoek)', value: 'Africa/Windhoek' },
	{ name: 'Egypt (Cairo)', value: 'Africa/Cairo' },
	{ name: 'Malawi (Blantyre)', value: 'Africa/Blantyre' },
	{ name: 'Libya (Tripoli)', value: 'Africa/Tripoli' },
	{ name: 'Ethiopia (Addis Ababa)', value: 'Africa/Addis_Ababa' },

	// Asia
	{ name: 'Cyprus (Nicosia)', value: 'Asia/Nicosia' },
	{ name: 'Lebanon (Beirut)', value: 'Asia/Beirut' },
	{ name: 'Syria (Damascus)', value: 'Asia/Damascus' },
	{ name: 'Israel (Jerusalem)', value: 'Asia/Jerusalem' },
	{ name: 'Jordan (Amman)', value: 'Asia/Amman' },
	{ name: 'Iraq (Baghdad)', value: 'Asia/Baghdad' },
	{ name: 'Yemen (Aden)', value: 'Asia/Aden' },
	{ name: 'Iran (Tehran)', value: 'Asia/Tehran' },
	{ name: 'UAE (Dubai)', value: 'Asia/Dubai' },
	{ name: 'Azerbaijan (Baku)', value: 'Asia/Baku' },
	{ name: 'Georgia (Tbilisi)', value: 'Asia/Tbilisi' },
	{ name: 'Armenia (Yerevan)', value: 'Asia/Yerevan' },
	{ name: 'Afghanistan (Kabul)', value: 'Asia/Kabul' },
	{ name: 'Russia (Yekaterinburg)', value: 'Asia/Yekaterinburg' },
	{ name: 'Pakistan (Karachi)', value: 'Asia/Karachi' },
	{ name: 'India (Kolkata)', value: 'Asia/Kolkata' },
	{ name: 'Sri Lanka (Colombo)', value: 'Asia/Colombo' },
	{ name: 'Nepal (Kathmandu)', value: 'Asia/Kathmandu' },
	{ name: 'Bangladesh (Dhaka)', value: 'Asia/Dhaka' },
	{ name: 'Myanmar (Rangoon)', value: 'Asia/Rangoon' },
	{ name: 'Russia (Novokuznetsk)', value: 'Asia/Novokuznetsk' },
	{ name: 'Hong Kong', value: 'Asia/Hong_Kong' },
	{ name: 'Russia (Krasnoyarsk)', value: 'Asia/Krasnoyarsk' },
	{ name: 'Brunei', value: 'Asia/Brunei' },
	{ name: 'Taiwan (Taipei)', value: 'Asia/Taipei' },
	{ name: 'Mongolia (Choibalsan)', value: 'Asia/Choibalsan' },
	{ name: 'Russia (Irkutsk)', value: 'Asia/Irkutsk' },
	{ name: 'East Timor (Dili)', value: 'Asia/Dili' },
	{ name: 'Japan (Tokyo)', value: 'Asia/Tokyo' },
	{ name: 'South Korea (Seoul)', value: 'Asia/Seoul' },
	{ name: 'Russia (Yakutsk)', value: 'Asia/Yakutsk' },

	// Australia/Pacific
	{ name: 'Australia (Perth)', value: 'Australia/Perth' },
	{ name: 'Australia (Adelaide)', value: 'Australia/Adelaide' },
	{ name: 'Australia (Darwin)', value: 'Australia/Darwin' },
	{ name: 'Australia (Brisbane)', value: 'Australia/Brisbane' },
	{ name: 'Australia (Melbourne)', value: 'Australia/Melbourne' },
	{ name: 'Australia (Currie)', value: 'Australia/Currie' },
	{ name: 'New Zealand (Auckland)', value: 'Pacific/Auckland' },
	{ name: 'Fiji', value: 'Pacific/Fiji' },
	{ name: 'Samoa (Apia)', value: 'Pacific/Apia' },

	// Antarctica
	{ name: 'Antarctica (Mawson)', value: 'Antarctica/Mawson' },
	{ name: 'Antarctica (Vostok)', value: 'Antarctica/Vostok' },
	{ name: 'Antarctica (Davis)', value: 'Antarctica/Davis' },
	{ name: 'Antarctica (DumontDUrville)', value: 'Antarctica/DumontDUrville' },
	{ name: 'Antarctica (Macquarie)', value: 'Antarctica/Macquarie' },

	// Indian Ocean
	{ name: 'Seychelles (Mahe)', value: 'Indian/Mahe' },
];

/**
 * Default timezone for campaigns
 */
export const DEFAULT_TIMEZONE = 'America/Chicago';
