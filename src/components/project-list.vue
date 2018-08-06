<template>
    <section class="main-content">
        <ul>
            <div v-for='(item, index) in items' class="spin-container" :class="{remove: $parent.editable}" @click.self="spinCard($event.target)">
                <li class="spinner" :name='item.name' :key='item.id'>
                    <div class='spinning-card front'>
                        <h2 v-text="item.name"></h2>
                        <span class="go-to" @click="gotoList(item.id)"><i class="material-icons">arrow_forward</i></span>
                    </div>
                    <div class='spinning-card back'>
                        <p v-text="truncate_text(item.text, 75, '...')"></p>
                        <span class="go-to" @click="gotoList(item.id)"><i class="material-icons">arrow_forward</i></span>
                    </div>
                </li>
                <button class="remove-project" name="remove" @click="remove(index, $event.target)"></button>
            </div>

            <li class="add-button" id="addNew">
                <button class="add" :class="{disabled: $parent.editable}" name="add-project" @click="$parent.togglePopup('add')">+</button>
            </li>
        </ul>

        <div class="popup add-new" id="add">
            <span class="close-btn icon-x" @click="$parent.togglePopup('add')"></span>
            <h2>Add a new project</h2>
            <p>Enter the title and description for your new project</p>
            <input type="text" class="title-input" name="title-input" placeholder="New Project" maxlength="25" />
            <textarea class="desc-input" name="desc-input" placeholder="Add a project description" wrap="hard" maxlength="280" />
            <button class="add close" @click="addNew($event.target)">Add Project</button>
        </div>
    </section>
</template>

<script>
    export default {
        name: 'projectList',
        props: [ 'items' ],
        mounted() {
            this.$parent.view = 'project_list';
            this.$parent.$el.classList.add('project_list');
            this.$parent.listTitle = 'Vue Project Checklist Testing';
        },
        methods: {
            addNew: function(evt) {
                let title = evt.parentNode.querySelector('input'),
                    desc = evt.parentNode.querySelector('textarea');

                if (title.value.length > 0) {
                    let introtext = document.querySelector('.main-content > p');
                    if (introtext) {
                        introtext.classList.add('inactive');
                        setTimeout(function() {
                            introtext.remove();
                        }, 400);
                    }
                    this.$parent.togglePopup('add');
                    let projects = this.items,
                        next = projects.length+1,
                        new_project = [];

                    new_project = JSON.parse(localStorage.getItem('project_list'));
                    let newItem = {
                        name: title.value,
                        text: desc.value,
                        id: next,
                        todos: [
                            { text: 'Artwork files use RGB colour space and correct resolution(s) for target device', checked: false },
                            { text: 'Artwork layers and groups clearly named', checked: false },
                            { text: 'Pixel values are a multiple of target device render scale (usually 2)', checked: false },
                            { text: 'Items are aligned to the pixel grid', checked: false },
                            { text: 'Elements are atomic - not dependent on a specific background colour or other ungrouped layers', checked: false },
                            { text: 'Additional assets included in the package - stock material, videos, fonts, etc.', checked: false },
                            { text: 'Include notes or other documentation from the design process', checked: false }
                        ]
                    };
                    new_project.push(newItem);
                    this.$parent.list.push(newItem);
                    localStorage.setItem('project_list', JSON.stringify(new_project));

                    setTimeout(function() {
                        desc.value = '';
                        title.value = '';
                        let last = projects.length - 1;
                        var listItems = document.querySelectorAll('.spin-container');
                        listItems[last].classList.add('loaded');
                        if (listItems[last-1]) listItems[last-1].classList.remove('loaded');
                    });
                } else {
                    evt.parentNode.classList.add('required-not-done');
                    setTimeout(function() {
                        evt.parentNode.classList.remove('required-not-done');
                    }, 1000);
                    title.classList.add('required');
                }
            },
            remove: function(index, el) {
                let projects = JSON.parse(localStorage.getItem('project_list')),
                    _this = this;

                el.parentNode.classList.add('removing');
                if (index > -1) {
                    setTimeout(function() {
                        projects.splice(index, 1);
                        _this.items.splice(index, 1);
                        localStorage.setItem('project_list', JSON.stringify(projects));
                    }, 400);
                };
            },
            spinCard: function(target) {
                event.stopPropagation();
                target.classList.toggle('active');
            },
            truncate_text: function(str, length, ending) {
                if (length === null) { length = 100; };
                if (ending === null) { ending = '...' };
                if (str.length > length) {
                    return str.substring(0, length - ending.length) + ending;
                } else {
                    return str;
                }
            },
            gotoList: function(id) {
                this.$parent.$el.classList.add('changing');
                let _this = this.$parent;
                setTimeout(function() {
                    _this.$parent.$el.classList.remove('project_list');
                    _this.current = id;
                    _this.view = "list_items";
                }, 350);
            }
        }
    }
</script>

<style lang="scss">
    #app {
        main { background-color: #F8F8F8; }
        &.changing.project_list {
            opacity: 0;
            background-color: #697C84;
            transition: all .32s ease-in-out;
        }
        &.project_list {
            opacity: 1; transition: opacity .32s ease-in-out;
           ul {
               margin: 0;
               list-style: none;
               display: flex;
               flex-flow: row wrap;
               justify-content: flex-start;
               width: 100%;
               padding: 32px;

               .spin-container {
                   perspective: 1000px;
                   height: 96px; width: 31%;
                   display: inline-block;
                   flex: 0 0 auto;
                   position: relative;
                   margin-bottom: 32px; margin-right: 3.5%;
                   transition: all .35s ease-in-out;
                   &:nth-child(3n) { margin-right: 0; }
                   &.active .spinner { transform: rotateY(180deg); }
                   &.loaded { animation: grow .45s; }
                   &.removing { animation: shrink .45s; }
                   .spinner { transition: .6s; transform-style: preserve-3d; position: relative; }
                   .remove-project {
                       height: 110px; width: 110px;
                       position: absolute;
                       background-color: transparent;
                       border: 2px solid white;
                       border-radius: 50%;
                       opacity: 0;
                       top: -2.2px; left: calc(50% - 55px);
                       animation: shrink .35s;
                       transition: opacity .05s ease-in-out .3s;
                       pointer-events: none;
                       z-index: 0;
                       cursor: pointer;

                       &:before, &:after {
                           content: "";
                           position: absolute;
                           display: inline-block;
                           height: 72px; width: 5px;
                           background-color: #E83182;
                           border-radius: 5px;
                           cursor: pointer;
                       }

                       &:before {
                           top: 18px; left: calc(50% - 2.5px);
                           transform: rotate(45deg);
                       }

                       &:after {
                           top: 18px; left: calc(50% - 2.5px);
                           transform: rotate(315deg);
                       }
                   }

                    &.remove {
                        .spinner {
                            transform: scale(.9);
                            margin-top: 9.6px;

                            .front, .back {
                                background-color: #555;
                                opacity: .7;
                                color: #e6e6e6;
                                transition: all .3s ease-in-out;
                            }
                        }
                        .remove-project {
                            z-index: 2;
                            pointer-events: auto;
                            opacity: 1;
                            animation: grow .35s;
                            transition: all .35s ease-in-out;
                        }
                    }


                   &:nth-of-type(4n+1) .front, &:nth-of-type(4n+1) .back { background-color: #697C84; }
                   &:nth-of-type(4n+2) .front, &:nth-of-type(4n+2) .back { background-color: #698474; }
                   &:nth-of-type(4n+3) .front, &:nth-of-type(4n+3) .back { background-color: #846981; }
                   &:nth-of-type(4n+4) .front, &:nth-of-type(4n+4) .back { background-color: #847c69; }

                   .front, .back {
                       height: 96px; width: 100%;
                       backface-visibility: hidden;
                       display: flex;
                       flex-flow: row wrap;
                       justify-content: space-between;
                       position: absolute;
                       top: 0; left: 0;
                       border: 2px solid #f7f7f7;
                       line-height: 25px;
                       text-align: center;
                       color: white;
                       padding: 16px;
                       border-radius: 10px;
                       user-select: none;
                       pointer-events: none;
                       transition: all .3s ease-in-out;

                       p {
                           display: inline-block;
                           font-size: 14px; width: 65%;
                           line-height: 21px;
                           text-align: left;
                           margin: 0;
                        }
                       h2 {
                           font-weight: 400;
                           text-align: left;
                           font-size: 20px; line-height: 32px;
                           width: 70%;
                           margin: 0;
                        }

                       .go-to {
                           border: 2px solid white;
                           height: 64px; width: 64px;
                           display: inline-table;
                           border-radius: 50%;
                           pointer-events: auto;
                           i {
                               font-size: 40px;
                               display: table-cell;
                               vertical-align: middle;
                               text-align: center;
                               font-weight: 300;
                           }
                       }
                   }
                   .spinning-card.front { z-index: 2; transform: rotateY(0deg); }
                   .spinning-card.back { transform: rotateY(180deg); }
               }
           }

           #add {
               input {
                   position: relative;
                   height: 32px; width: 100%;
                   margin-top: 16px;
                   background-color: transparent;
                   border: 0;
                   color: #697C84;
                   font-size: 18px;
                   padding-top: 6px; padding-bottom: 8px;
                   padding-left: 8px; padding-right: 8px;
                   outline: none;
                   border-bottom: 2px solid #697C84;
                   border-radius: 2px;
                   transition: border-color .35s ease-in-out;
               }

               textarea {
                   margin-top: 32px;
                   border: 2px solid #697C84;
                   border-radius: 3px;
                   width: 100%; height: 128px;
                   resize: none;
                   padding: 8px;
                   font-size: 14px; color: #0F0A30;
                   font-family: 'Open Sans', Arial, sans-serif;
                   transition: border-color .35s ease-in-out;
               }
               button { margin-top: 21px; }

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

    @keyframes grow {
        0% { transform: scale(0); }
        80% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }

    @keyframes shrink {
        0% { transform: scale(1); }
        20% { transform: scale(1.2); }
        100% { transform: scale(0); }
    }

    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
