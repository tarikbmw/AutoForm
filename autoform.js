/**
 * Process form request and response
 * @param form
 * @param submit
 */
let processRequestForm = (form, submit) =>
{
    let request         = new XMLHttpRequest();

    /**
     * Output block text value while form request processed
     * @type {string}
     */
    const waitText      = 'Ожидайте...';

    /**
     * Response output block
     * @type {ActiveX.IXMLDOMNode | ChildNode | (() => (Node | null))}
     */
    let responseOutput  = form.lastChild;
    let inputElements   = Array.from(form.getElementsByTagName('input'));

    submit.setAttribute('disabled', 'disabled');
    form.setAttribute('disabled', 'disabled');

    request.open(form.method, form.action, true);
    request.addEventListener('load', event =>
    {
        submit.removeAttribute('disabled');
        form.removeAttribute('disabled');
        inputElements.forEach(item => item.removeAttribute('disabled'));
        if (!request.responseXML)
            return;

        let response = request.responseXML.documentElement;

        responseOutput.className    = response.getAttribute('response');
        responseOutput.textContent  = response.getAttribute('message');

        let redirect = response.getAttribute('redirect');
        if (redirect)
        {
            let tm = setTimeout(() =>
            {
                clearTimeout(tm);
                window.location.href = redirect;
            }, 4500);
        }

        let tm = setTimeout(() =>
        {
            clearTimeout(tm);
            responseOutput.className = '';
            responseOutput.textContent = '';
        }, 6000);
    });

    request.send(new FormData(form));
    inputElements.forEach(item => item.setAttribute('disabled', 'disabled'));
    responseOutput.textContent = waitText;
    responseOutput.className = 'processing';
}

/**
 * Bind form AJAX requests
 */
document.addEventListener('DOMContentLoaded', event =>
{
    Array.from(document.forms).forEach(item =>
    {
        let submit = item.querySelector('input[type=submit]');
        if (!submit)
        {
            console.log('Unable to find submit button.');
            return;
        }

        item.onsubmit = event =>
        {
            event.preventDefault();
            processRequestForm(item, submit);
        };
    });
});