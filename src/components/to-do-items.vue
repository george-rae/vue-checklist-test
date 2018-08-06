<template>
    <li class="todo-list-item" :class="{inactive: $parent.$parent.editable}">
        <input v-bind:id="id" type="checkbox" v-model="todo.checked" @change="update" />
        <label v-text="todo.text" v-bind:for="id" />
        <div class="action-buttons" :class="{active: $parent.$parent.editable}">
            <span class="edit-handle">
                <i class="material-icons">drag_handle</i>
            </span>
            <button class="delete" @click="remove_task(id)"></button>
        </div>
    </li>
</template>

<script>
    let current_project;

    export default {
        name: 'TodoItems',
        props: [ 'list', 'todo', 'id' ], // this.propname is how to reference these!
        methods: {
            update: function() {
                let _this = this,
                    project = JSON.parse(localStorage.getItem("project_list"));

                setTimeout(function() {
                    let updated = _this.list;
                    localStorage.setItem('project_list', JSON.stringify(updated));
                }, 150);
            },
            remove_task: function(id) {
                let this_list = this.$parent.$parent.current - 1,
                    this_todo = this.list[this_list].todos,
                    todo_list = JSON.parse(localStorage.getItem('project_list'));

                if (id > -1) {
                    this_todo.splice(id, 1);
                    todo_list[this_list].todos.splice(id, 1);
                    localStorage.setItem('project_list', JSON.stringify(todo_list));
                };
            }
        }
    }
</script>

<style lang="scss">
    #app.list_items {
        li:not(.add-button) {
            position: relative;
            color: #0F0A30;
            height: 64px; width: 100%;
            font-weight: 500;
            margin: 0; padding: 16px 32px;
            &:last-child { border-bottom: 0; }
            &:nth-child(2n+1) { background-color: #f1f1f1; }
            &.inactive {
                label { opacity: 0.8; transition: all .35s ease-in-out; pointer-events: none; }
                input[type="checkbox"] {
                    user-select: none;
                    pointer-events: none;
                    border-color: #999;
                    transition: all 0s ease-in-out;
                    animation: none;
                    &:checked { background-color: #999; border-color: #999; }
                }
            }

            label {
                background: transparent;
                border: 0;
                font-size: 20px;
                font-weight: 200;
                height: 32px; line-height: 32px;
                vertical-align: top;
                width: calc(100% - 50px);
            }
            &:not(.inactive) input {
                transition-property: background-color, border-color, transform;
                transition-duration: .35s;
                transition-timing-function: ease-in-out, ease-in-out, cubic-bezier(0,7,1,1);
                &:checked {
                    transition-property: background-color, border-color, transform;
                    transition-duration: .35s;
                    transition-timing-function: ease-in-out, ease-in-out, cubic-bezier(0,8.5,1,1);
                }
            }


            input[type="checkbox"] {
                -webkit-appearance: none;
                appearance: none;
                position: relative;
                background-color: white;
                height: 32px; width: 32px;
                border-radius: 50%;
                margin: 0; border: 2px solid #697C84;
                margin-right: 10px;
                transform: scale(1);
                outline: none;
                &::after {
                    content: "";
                    height: 100%; width: 100%;
                    position: absolute;
                    top: 0; left: 0;

                }

                &:checked {
                    background-color: #697C84;
                    border-color: #697C84;
                    transform: scale(1.1);
                }
            }

            .action-buttons {
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
                width: 60px; height: 32px;
                position: absolute;
                top: 16px; right: -75px;
                transition: right .35s ease-in;
                &.active { right: 16px; transition: right .35s ease-out; }
                .edit-handle {
                    font-size: 20px; line-height: 20px;
                    font-family: Arial;
                    margin-top: 11px;
                    width: 30px; height: 10px;
                    padding: 0; user-select: none;
                    cursor: move;
                    cursor: -webkit-grabbing;

                    i {
                        height: 10px; width: 30px;
                        text-align: center; line-height: 10px;
                        font-size: 30px;
                        color: #666;
                    }
                }

                button.delete {
                    -webkit-appearance: none;
                    position: relative;
                    border: none;
                    background: none;
                    width: 20px; height: 20px;
                    padding: 0; margin-top: 6px;
                    outline: none;
                    cursor: pointer;

                    &:before, &:after {
                        content: "";
                        position: absolute;
                        display: inline-block;
                        height: 22px; width: 3px;
                        background-color: #E83182;
                        border-radius: 5px;
                        cursor: pointer;
                    }

                    &:before {
                        top: -2px; left: 7.5px;
                        transform: rotate(45deg);
                    }

                    &:after {
                        top: -2px; left: 7.5px;
                        transform: rotate(315deg);
                    }
                }
            }
        }
    }
</style>
