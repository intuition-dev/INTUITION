## PROJECT STRUCTURE

View/Model structure
1. there is a 'models' folder inside assets, where we describe each class/model without UI, its typescript;
    to compile the changes in the typescript file: tsc
    The models do the heavy lifting, eg: call the service and prepare data in a way that is needed for the View and Pug.
    The models are testable. 

2. each page will have its own binding class eg: MainBind, ProjectsBind etc, where we do data binding
3. there is no calls to Model classes from the pages, if you want to get any data, you need to create Binding class in the same folder, and from there make a call to the Model class.