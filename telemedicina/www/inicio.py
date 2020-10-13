# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe

no_cache = 1

def get_context(context):
    homepage = frappe.get_doc('Homepage')
    quick_blocks = frappe.get_doc('Homepage Section','Quick blocks')
    descubre = frappe.get_doc('Homepage Section','Descubre Hisalud')
    testimonios = frappe.get_doc('Homepage Section','Testimonios')
    profesionales = frappe.get_doc('Homepage Section','Descubre profesional de la salud')
    for item in homepage.products:
        route = frappe.db.get_value('Item', item.item_code, 'route')
        if route:
            item.route = '/' + route

    homepage.title = homepage.title or homepage.company
    context.title = homepage.title
    context.homepage = homepage
    context.quick_blocks = quick_blocks

    if homepage.hero_section_based_on == 'Homepage Section' and homepage.hero_section:
        homepage.hero_section_doc = frappe.get_doc('Homepage Section', homepage.hero_section)

    if homepage.slideshow:
        doc = frappe.get_doc('Website Slideshow', homepage.slideshow)
        context.slideshow = homepage.slideshow
        context.slideshow_header = doc.header
        context.slides = doc.slideshow_items
    context.profesionales = profesionales.section_cards
    context.hisalud = descubre.section_cards
    context.testimonios = testimonios.section_cards
    context.blogs = frappe.get_all('Blog Post',
        fields=['title', 'blogger', 'blog_intro', 'route'],
        filters={
            'published': 1
        },
        order_by='modified desc',
        limit=3
    )
    context.metatags = context.metatags or frappe._dict({})
    context.metatags.image = homepage.hero_image or None
    context.metatags.description = homepage.description or None
    context.explore_link = '/all-products'
