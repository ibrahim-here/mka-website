export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Landscape', value: 'landscape'},
          {title: 'Hospitality', value: 'hospitality'},
          {title: 'Religious', value: 'religious'},
          {title: 'Health', value: 'health'},
          {title: 'Transport', value: 'transport'},
          {title: 'Education', value: 'education'},
          {title: 'Commercial', value: 'commercial'},
          {title: 'Residential', value: 'residential'},
          {title: 'Industrial', value: 'industrial'},
          {title: 'Planning', value: 'master-planning'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'gallery',
      title: 'Project Gallery (Extra Images)',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        layout: 'grid',
      }
    },
    {
      name: 'featured',
      title: 'Featured (Show on Homepage)',
      type: 'boolean',
      initialValue: false
    }
  ],
}
