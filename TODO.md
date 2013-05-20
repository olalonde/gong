- Use an evented approach: event before initializing, before server is
started, etc. This makes it easy to extend the framework by adding
custom initializers, etc. Should support sync and async events so that
we can wait for an event listener to be done before launching the server
for example.
