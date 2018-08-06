<template>
    <header>
        <section v-if="this.$parent.view === 'project_list' ">
            <h2 class="title">{{ pagetitle }}</h2>
            <div>
                <button type="button" name="edit" @click="removeProjects"><i class="material-icons">edit</i></button>
            </div>
        </section>
        <section v-else-if="this.$parent.view === 'list_items' ">
            <input disabled="true" type="text" class="title non-editable" maxlength="25" :value="pagetitle" @input.self="update_title($event.target, $event)" @blur="minimum($event.target, 'Project Name')">
            <div class="bar"></div>
            <div>
                <button type="button" name="home" @click="goHome"><i class="material-icons">home</i></button>
                <button type="button" name="edit" @click="editState"><i class="material-icons">edit</i></button>
            </div>
        </section>
    </header>
</template>

<script>
    export default {
        props: [ 'pagetitle', 'editable' ],
        methods: {
            goHome: function() {
                if (this.$parent.editable === true) this.editState();
                this.$parent.$el.classList.add('changing');
                let _this = this.$parent;
                setTimeout(function() {
                    _this.view = "project_list";
                    _this.$el.classList.add('project_list');
                    _this.$el.classList.remove('changing');
                    _this.$el.classList.remove('list_items');
                }, 350);
            },
            removeProjects: function() {
                if (this.$parent.editable === false) {
                    this.$parent.editable = true;
                    document.querySelector('button[name="edit"] i').innerText = "done";
                }
                else if (this.$parent.editable === true) {
                    this.$parent.editable = false;
                    document.querySelector('button[name="edit"] i').innerText = "edit";
                }
            },
            editState: function() {
                if (this.$parent.editable === false) {
                    this.$parent.editable = true;
                    document.querySelector('button[name="edit"] i').innerText = "done";
                    var tochange = document.querySelectorAll('.non-editable');
                    for (let i = 0; i < tochange.length; i++) {
                        tochange[i].classList.remove('non-editable');
                        tochange[i].classList.add('editable');
                        if (tochange[i].classList.contains('nolength')) tochange[i].classList.remove('inactive');
                        tochange[i].disabled = false;
                    }
                } else if (this.$parent.editable === true) {
                    this.$parent.editable = false;
                    document.querySelector('button[name="edit"] i').innerText = "edit";
                    var tochange = document.querySelectorAll('.editable');
                    for (let i = 0; i < tochange.length; i++) {
                        tochange[i].classList.remove('editable');
                        tochange[i].classList.add('non-editable');
                        if (tochange[i].classList.contains('nolength')) tochange[i].classList.add('inactive');
                        tochange[i].disabled = true;
                    }
                }
            },
            update_title: function(title, e) {
                let _this = this,
                    parent = this.$parent,
                    project = JSON.parse(localStorage.getItem("project_list")),
                    updated_title = project[this.$parent.current-1];

                setTimeout(function() {
                    updated_title.name = title.value;
                    _this.$parent.list[_this.$parent.current-1].name = title.value;
                    project[_this.$parent.current-1] = updated_title;
                    localStorage.setItem('project_list', JSON.stringify(project));
                }, 300);
            },
            minimum: function(title, replacement) {
                if (title.value.length < 1) {
                    title.value = "Project Name";
                    this.update_title(title);
                }
            }
        },
    }
</script>

<style lang="scss">
    header {
        top: 0;
        padding: 14px 32px 16px 32px;
        height: 64px;
        position: relative;
        background-color: #697C84;
        color: #FFF;
        section {
            display: flex;
            justify-content: space-between;
            height: 32px;
        }

        h2 {
            height: 32px; width: auto;
            display: inline-block;
            margin: 0; line-height: 32px;
        }

        input {
            height: 32px; width: auto;
            display: inline-block;
            color: #f2f2f2;
            font-size: 24px;
            line-height: 24px;
            min-width: 400px;
            font-family: "Open Sans", sans-serif;
            padding-top: 3px; padding-bottom: 5px;
            margin: 0;
            background: transparent;
            border: 0;
            &+.bar {
                width: 100%; max-width: 0px;
                height: 2px;
                background-color: white;
                border-radius: 2px;
                position: absolute;
                top: 48px; left: 32px;
                transition: max-width .56s cubic-bezier(0,1.6,1,1.5);
            }

            &.editable + .bar {
                max-width: 400px;
                transition: max-width .56s cubic-bezier(0,1.4,1,1.15);
                outline: none;
            }
        }

        div {
            width: 100px; display: inline-flex;
            flex-flow: row wrap;
            justify-content: space-between;

            button {
                background: transparent;
                height: 100%; width: 45%;
                padding: 0; margin: 0;
                border: 0; opacity: 1;
                user-select: none; outline: none;
                transition: opacity .35s ease-in-out;
                pointer-events: auto;
                cursor: pointer;
                i { color: white; font-size: 2rem; line-height: 2rem; }
            }
        }
    }
</style>
