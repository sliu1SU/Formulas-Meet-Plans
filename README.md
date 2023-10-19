# Formulas-Meet-Plans
a backend Express.js server

# Please refer to API Documentation for the functionalities and url of each API in the server

# REST API
Write an Express.js server that provides a REST API which allows clients to perform the tasks listed below. This assignment is specifically about API design and JavaScript fundamentals. You will not need to generate HTML, nor will you need to persist data in a database.

# Domain
You are writing a service which allows clients to manage and simulate production plans. You have two main entities to work with: formulas and plans.
A formula tells you how to convert resources into other resources. A formula consists of a collection of inputs and a collection of outputs. Examples include:
2 iron ore -> 1 iron bar
3 iron ore, 1 coal -> 1 steel bar
1000 water -> 999 hydrogen, 1 deuterium
2 butter, 3 egg, 1 sugar, 2 flour, 2 baking soda -> 36 cookies
A plan is an ordered sequence of formulas. One example would be a sequence of two formulas: one to convert wood to coal followed by the one to produce steel listed above.

# Interface
# Your service must allow clients to do the following:
Add a new formula.
See the inputs and outputs of a specific formula.
List which plans contain a specific formula.
Add a new plan.
Append a formula to the end of a plan.
Replace a formula anywhere in the sequence of formulas associated with a plan.
List all the formulas contained in a plan.
Delete a plan.
You should follow best practices for REST design - using appropriate verbs, putting parameters in the correct parts of the HTTP request, etc. Within those constraints, there any many open questions you will have to answer for yourself, such as how to identify specific entities and what parameters you should require or allow for each request. There are often multiple right answers in API design, so pick what makes sense to you and leave comments justifying your decisions.

# Documentation
APIs are only useful if your clients can understand how to use them. In the same folder as your code, include a document (Markdown, HTML, Word, or PDF) that describes how to use your API. For each action the client can take, write the following:
The method and path used to trigger the action.
A sentence saying what the action does.
What parameters the action involves. For each parameter, list:
its name (if in the path or query)
where it goes (path, query, or body)
its domain (e.g. non-negative numbers, objects with particular fields, any non-empty string)
What response codes the action could result in and what they mean in this specific context.
What the response body will contain.
