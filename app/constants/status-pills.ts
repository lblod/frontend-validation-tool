export const STATUS_PILL_TYPES = {
  correct: {
    name: 'Correct',
    skin: 'success',
    description:
      'Een klasse is correct wanneer alle velden van een klasse alsook de velden van de subklassen correct zijn ingevuld.',
  },
  whole: {
    name: 'Volledig',
    skin: 'success',
    class: 'au-c-pill--whole',
    description:
      ' Een klasse is volledig wanneer alle verplichte velden van een klasse zijn ingevuld. Opgelet: een klasse kan volledig zijn, maar toch incorrect.',
  },
  invalid: {
    name: 'Onvolledig',
    skin: 'error',
    description:
      ' Een klasse is onvolledig wanneer niet alle verplichte velden van een klasse zijn ingevuld.',
  },
  optional: {
    name: 'Optioneel',
    skin: 'warning',
    description:
      ' Een klasse is optioneel wanneer deze niet verplicht is om in te vullen.',
  },
  unvalidated: {
    name: 'Niet gevalideerd',
    skin: 'default',
    description:
      ' Een klasse is niet gevalideerd wanneer er geen schema is om deze tegen te valideren.',
  },
};
