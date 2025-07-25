Express Milo is a unique CMS system that engages with content authors without an inbuilt editor, but leverages
existing applications such as Sharepoint or Google Docs to generate MD files that are converted into plain HTML files, then parsed 
client side into the final user facing view via JS.

A typical authoring workflow involves opening a Sharepoint document, deciding what block to use, and injecting a table into the document.

The first row of the table always contains the exact name of the block and any CSS classes that you want to add to this block.

block_name (class1, class2, class3, etc)

The usage of these classes can be used to create extreme amounts of customization. 

Sharepoint tables are converted into the following format in plain HTML, and it is this structure that all blocks assume when they execute
their decorate() function.

<div class="block_name">
    <div>
        <div>
            row 1, column 1 content
        </div>
         <div>
            row 1, column 2 content
        </div>
         <div>
            row 1, column 3 content
        </div>
    </div>
     <div>
        <div>
            row 2, column 1 content
        </div>
         <div>
            row 2, column 2 content
        </div>
         <div>
            row 2, column 3 content
        </div>
    </div>
</div>

Express Milo blocks assume that a given html structure will be provided. Image content can be included inside each cell of the table.

Link elements <a> will automatically be converted into buttons via adding the .con-button class before block decoration.

Elements may be bolded via <strong> or italisized via <em>, authors will use these tags to specify different behavior on a block level. 

Header elements such as <h1> - <h6> are passed into the plain HTML as well.