# CustomPrompt
A wrapper for react-router-dom Prompt to display `Confirm` Modal

## Prompt
Used to prompt the user before navigating away from a page. When your application enters a state that should 
prevent the user from navigating away (like a form is half-filled out), render a `<Prompt>`.

## How to use
```javascript
<CustomPrompt
  when={[inTheMiddleOfEditing]}
  message="Are you sure you want to leave?"
/>
```

Refer to: https://reactrouter.com/core/api/Prompt