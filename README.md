# Formidable

> It's as simple as a HTML Form

## What is it ?

Just add one drop of **Formidable** to your website and get a contact form just like that !

**Formidable** is a web service that you can send HTML Forms to, and read all the forms sent. You don't have to buy a web server for the contact form in your static website anymore.

## How does it works ?

You just need to provide the url we'll give you, add the right inputs in your form and tada 🎉

Here are the inputs you can add (feel free to add client-side validation with HTML attributes) :

- `from` : So you can know who's sending you a message
- `object` : So you can know what people are contacting you about
- `content` : This one is actually required, you can put it inside a `textarea`

Here is a *working* example :

```html
<form action="https://formidable.site/formidable-site">
	<div>
		<label for="from">Your email</label>
		<input name="from" type="email"/>
	</div>

	<div>
		<label for="object">What's this about ?</label>
		<input name="object" type="text"/>
	</div>

	<div>
		<label for="content">Your message</label>
		<textarea name="content"/>
	</div>

</form>
```

## Roadmap

- Add mail transfer so you can receive a mail for each messages
- Add better UI to the message list (bulk actions for example)
- Add a better security option (checking if the origin url matches the registered website domain)
