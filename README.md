# [NativeJsView](https://github.com/devSonicgirl/nativeJsView) v0.9

This is a view template that uses native javascript code in HTML.

If you know how to do javascript, you do not have to study any grammar, you can use it immediately.

It is very simple, very easy and very fast.

## Requires
jQuery-1.x or later.

## Usage
Include jquery.nativeJsView.js.
````html
<script src="jquery.nativeJsView.min.js"  type="text/javascript"></script>
````

### Syntax

Remember these two things. `<!--_ javascript code -->` And `<!--= Javascript variable -->`

Use `<!--_` when starting javascript syntax in HTML.
````html
<div>
<!--_ if ( color == 'red' ) { -->
        <p>This is red.<p>
<!--_ } else { -->
        <p>This is not red.<p>
<!--_ } -->
</div>
````

Use `<!--=` when output javascript variables.
````html
<div><!--= color --></div>
````

### Data Injection
````html
<div id="template">
    <p>Name : <!--= name --></p>
    <p>Age : <!--= age --></p>
    <p>Birthday : <!--= birthday --></p>
</div>

<script>
var person = {
    name : 'Michelle Lee',
    age : 17,
    birthday : '2000-03-01'
};

$(document).ready(function(){
    $("#template").nativeJsView(person);
});
</script>
````
You can create a template to inject data and inject the prepared data.

If you want to update the data, use `nativeJsView.refresh(update_data)`.


````javascript
$(document).ready(function(){
    var templateView = $("#template").nativeJsView(person);

    // update
    person.age = 20;
    templateView.refresh(person);
    // or
    // $("#template").nativeJsView(person);
});
````

## Example
example.html
````html
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <script src="https://code.jquery.com/jquery-1.12.4.min.js" type="text/javascript"></script>
    <script src="jquery.nativeJsView.min.js"  type="text/javascript"></script>
</head>
<body>
<div id="company">    
    <div>Company Name : <!--= company_name --></div>
    <div>City : <!--= city --></div>
    <div>Employee List</div>
    <table>
    <!--_
        if ( employee ) {
            $.each(employee, function(no, emp){
                var color;
                if ( emp.gender == 'male' ) color = 'blue';
                else color = 'red';
    -->
        <tr style="background-color:<!--= color -->">
            <td><!--= emp.name --></td>
            <td><!--= emp.age --></td>
            <td><!--= emp.gender=='male' ? 'M' : 'F' --></td>
        </tr>
    <!--_
            })
        }
    -->
    </table>
</div>    
</body>

<script>
$(document).ready(function(){
    $.get('company_data.json',function(company_data){
        $("#company").nativeJsView(company_data);
    },'json');
});
</script>

</html>    
````

company_data.json
````json
{
    "company_name" : "ABCDEF Mart",
    "city" : "Seoul",
    "employee" : [
        {
            "name" : "Andrew",
            "age" : 25,
            "gender" : "male"
        },
        {
            "name" : "Olivia",
            "age" : 22,
            "gender" : "female"
        },
        {
            "name" : "John",
            "age" : 23,
            "gender" : "male"
        }
    ]
}
````
