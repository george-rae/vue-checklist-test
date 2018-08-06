<template>
    <section class="main-content">
        <div class="special-sauce">
            <div placeholder="Add project description here..." v-contenteditable:description="editable" class="project-description non-editable" @input.self="update_description" :class="{nolength: description.length < 1, inactive: description.length < 1 && !editable}" />
            <div class="top right"></div>
            <div class="bottom left"></div>
        </div>
        <draggable v-model="list_items[current-1].todos" element="ul" :options="{handle: '.edit-handle', animation: 250, draggable: '.todo-list-item' }" @end="onEnd">
            <TodoItems v-for="(todo, index) in list_items[current-1].todos" :list="list_items" :key="'item-'+index" :id="index" :todo="todo"></TodoItems>
            <li class="add-button" id="add-task">
                <button class="add" name="add-project" @click="$parent.togglePopup('add')">+</button>
            </li>
        </draggable>

        <div class="popup add-task" id="add">
            <span class="close-btn icon-x" @click="$parent.togglePopup('add')"></span>
            <h2>Add a new task</h2>
            <p>Enter the new task description</p>
            <input type="text" class="task-input" name="task-input" placeholder="New task" maxlength="100" />
            <button class="add close" @click="newTodo($event.target)">Add task</button>
        </div>
    </section>
</template>

<script>
    let current_project;
    import TodoItems from './to-do-items.vue';
    import draggable from 'vuedraggable';

    export default {
        name: 'listItems',
        components: { TodoItems, draggable },
        props: [ 'current', 'list_items', 'editable' ], // this.propname is how to reference these!
        mounted() {
            var _this = this;
            current_project = this.list_items[this.current-1];
            this.$parent.listTitle = current_project.name;
            this.$parent.$el.classList.remove('changing');
            this.$parent.$el.classList.add('list_items');
        },
        data() {
            return {
                description: this.list_items[this.current-1].text
            }
        },
        methods: {
            newTodo: function(evt) {
                let task = document.querySelector('.task-input');
                if (task.value.length > 0) {
                    let toDoList = current_project.todos,
                        next = toDoList.length+1,
                        new_todo = [];

                    new_todo = JSON.parse(localStorage.getItem('project_list'));
                    this.$parent.togglePopup('add');
                    let newTodo = {
                        text: task.value,
                        checked: false
                    };
                    new_todo[this.current-1].todos.push(newTodo);
                    this.$parent.list[this.current-1].todos.push(newTodo);
                    localStorage.setItem('project_list', JSON.stringify(new_todo));

                    setTimeout(function() {
                        let last = toDoList.length - 1;
                        var listItems = document.querySelectorAll('.todo-list-item');
                        listItems[last].classList.add('loaded');
                        task.value = "";
                    })
                } else {
                    evt.parentNode.classList.add('required-not-done');
                    setTimeout(function() {
                        evt.parentNode.classList.remove('required-not-done');
                    }, 1000);
                    task.classList.add('required');
                }
            },
            onEnd: function(evt) {
                let projects = JSON.parse(localStorage.getItem('project_list')),
                    current_project = this.list_items[this.current-1];
                projects[this.current-1] = current_project;
                localStorage.setItem('project_list', JSON.stringify(projects));
            },
            update_description: function(el, event) {
                let _this = this,
                    updated_description = JSON.parse(localStorage.getItem("project_list")),
                    updated_project = updated_description[this.current-1];
                    console.log("updating");

                setTimeout(function() {
                    current_project.text = _this.description;
                    updated_project.text = _this.description;
                    updated_description[_this.current-1] = updated_project;
                    localStorage.setItem('project_list', JSON.stringify(updated_description));
                }, 300);
            }
        }
    }
</script>

<style lang="scss">
    #app.list_items {
        opacity: 1;
        transition: opacity .35s ease-in-out;

        &.changing { opacity: 0; transition: all .35s ease-in-out; background-color: #f7f7f7; }
        main {
            padding-top: 0;
            display: flex;
            flex-flow: column nowrap;
            background-color: #f7f7f7;

            .special-sauce {
                width: 100%; height: auto;
                padding: 0 32px;
                position: relative;

                .project-description {
                    display: block;
                    width: 100%;
                    font-family: 'Open Sans', sans-serif;
                    font-size: 18px; font-weight: 300;
                    border-bottom: 2px solid transparent;
                    border-radius: 2px;
                    line-height: 32px;
                    text-align: left;
                    margin: 16px 0;
                    min-height: 32px; max-height: 128px;
                    padding: 16px;
                    color: #0F0A30;
                    background-color: transparent;
                    resize: none;
                    overflow: hidden;
                    transition-property: padding, margin, max-height, min-height, border;
                    transition-duration: .35s;
                    transition-timing-function: ease-in-out;
                    transition-delay: 0s, 0s, .15s, .15s, .10s;
                    &[placeholder]:empty:before { content: attr(placeholder); color: #555; cursor: text; }
                    [placeholder]:empty:focus:before { content: ""; }

                    &.inactive {
                        max-height: 0px; min-height: 0;
                        padding: 0; margin: 0 0;
                        transition-property: padding, margin, max-height;
                        transition-duration: .35s;
                        transition-timing-function: ease-in-out;
                        transition-delay: .15s, .15s, 0s;
                    }

                    &[contenteditable="true"] {
                        border-bottom: 2px solid #0F0A30;
                        transition: border .35s ease-in-out .15s;
                    }
                }
            }

            ul {
                padding: 0; margin: 0;
                list-style: none;
            }

            #add {
                height: 294px;
                input {
                    position: relative;
                    height: 32px; width: 100%;
                    margin-top: 16px;
                    background-color: transparent;
                    border: 0;
                    color: #0F0A30;
                    font-size: 18px;
                    padding-top: 6px; padding-bottom: 8px;
                    padding-left: 8px; padding-right: 8px;
                    outline: none;
                    border-bottom: 2px solid #003D6A;
                    border-radius: 2px;
                    transition: border-color .35s ease-in-out;
                }
                .required { border-color: red; transition: border-color .3s ease-in-out; }

                &.required-not-done {
                    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
                    transform: translate3d(0, 0, 0);
                    backface-visibility: hidden;
                    perspective: 1000px;
                }
            }
        }
    }
</style>
