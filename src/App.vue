<template>
    <div id="app">
        <Header v-model="listTitle" :pagetitle="listTitle" :editable="editable"></Header>
        <main v-if="this.view == 'project_list' || this.view == ''">
            <ProjectList key="$route" v-model="list" :items="list"></ProjectList>

            <div class="popup first-time" id="new">
                <h2>Deliver with confidence</h2>
                <p>Planning a new project can be a daunting task - especially when wanting to impress a new client or working in an unfamiliar project area.</p>
                <p>We’ve developed a simple checklist tool sharing our secret recipe for a smooth project handover. Need something extra? Add or customise steps to come up with your own perfect project companion.</p>
                <button class="get-started close" @click="togglePopup('new')">Let's get started!</button>
            </div>
        </main>
        <main v-else-if="this.view == 'list_items'">
            <ListItems v-model="list" :current="current" :list_items="list" :editable="editable"></ListItems>
        </main>
        <footer>
            <div class="footer-links">
                <a href="https://www.instagram.com/george_rae/?hl=en" target="_blank" class="text-right"><img src="https://george-rae.github.io/vue-checklist-test/src/assets/images/instagram.png" alt="Instagram" /></a>
            </div>
        </footer>
    </div>
</template>

<script>
    let stored_list;
    import Header from './components/header.vue';
    import ProjectList from './components/project-list.vue';
    import ListItems from './components/list-items.vue';

    export default {
        name: 'app',
        components: { Header, ProjectList, ListItems },
        mounted() {
            if (localStorage) {
                if(localStorage.getItem('project_list') === null || localStorage.getItem('project_list') === "[]") {
                    stored_list = [];
                    localStorage.setItem('project_list', JSON.stringify(stored_list));
                    let p = document.createElement('p');
                    let _this = this;
                    p.innerText = "Press the plus button at the bottom of the screen to add a project and get started";
                    document.querySelector('.main-content').insertBefore(p, document.querySelector('ul'));
                    setTimeout(function() {
                        _this.togglePopup('new');
                    }, 200);
                } else {
                    stored_list = JSON.parse(localStorage.getItem('project_list'));
                    this.list = stored_list;
                }
            }
        },
        data () {
            return {
                listTitle: '',
                msg: 'Welcome to Your Vue.js App',
                view: '',
                current: null,
                editable: false,
                // images: {
                //     instagram: require('./assets/images/instagram.png')
                // },
                list: []
            }
        },
        methods: {
            togglePopup: function(id) {
                let popup = document.querySelector("#" + id);
                popup.classList.toggle('active');
                document.body.classList.toggle('popup--active');
                console.log('opened');
            }
        }
    }
</script>

<style lang="scss">
    html { background-color: #e6e6e6; }
    body {
        margin: 0;
        font-family: 'Open Sans', sans-serif;
        box-sizing: border-box;
        position: relative;
        height: 100vh;
        overflow: hidden;
        * { box-sizing: border-box; }
        &:after {
            content: "";
            height: 100vh; width: 100vw;
            background-color: rgba(0, 0, 0, .7);
            position: absolute;
            top: 0; left: 0;
            z-index: -1;
            opacity: 0;
            transition: all .45s ease-in-out;
        }
        &.popup--active { user-select: none; }
        &.popup--active:after {
            opacity: 1;
            z-index: 1;
            transition: all .45s ease-in-out;
        }

        #app {
            max-width: 1280px;
            margin-left: auto; margin-right: auto;
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-between;
        }
    }

    main {
        width: 100%;
        height: calc(100vh - 128px);
        padding-top: 32px;
        overflow: hidden;
        .popup {
            background-color: white;
            padding: 32px;
            color: #697C84;
            position: absolute;
            width: 500px; height: 448px;
            top: 50%; left: 50%;
            border-radius: 12.5px;
            margin-left: -250px; margin-top: -224px;
            z-index: 10;
            -webkit-transform: translate3d(0, -250px, 0) scale(0); /* TODO: get direction from DH on transition */
            transform: translate3d(0, -250px, 0) scale(0);
            -webkit-transition: opacity .25s linear 0s, -webkit-transform .45s cubic-bezier(.6,0,.4,1) 0s, visibility 0s linear .45s;
            transition: opacity .25s linear 0s, -webkit-transform .45s cubic-bezier(.6,0,.4,1) 0s, visibility 0s linear .45s;
            visibility: hidden;

            span.close-btn {
                position: absolute;
                width: 20px; height: 20px;
                padding: 0; margin-top: 0;
                outline: none;
                right: 16px; top: 16px;
                cursor: pointer;

                &:before, &:after {
                    content: "";
                    position: absolute;
                    display: inline-block;
                    height: 22px; width: 3px;
                    background-color: #697C84;
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

            h2 { margin: 0; font-size: 26px; line-height: 32px; }
            p { line-height: 28px; font-size: 16px; margin-bottom: 0; margin-top: 34px; }
            p:last-of-type { margin-top: 26px; }
            button {
                display: block;
                background-color: transparent;
                border: 2px solid #697C84;
                color: #697C84;
                font-size: 22px; line-height: 60px;
                font-weight: 300;
                height: 64px; width: 200px;
                margin-top: 32px; padding: 0;
                margin-left: auto; margin-right: auto;
                border-radius: 10px;
            }

            &.active {
                -webkit-transform: translate3d(0, 0%, 0) scale(1);
               transform: translate3d(0, 0%, 0) scale(1);
               opacity: 1;
               visibility: visible;
               -webkit-transition-delay: 0s, 0s, 0s;
               transition-delay: 0s, 0s, 0s;
            }
        }

        section.main-content {
            overflow-y: auto;
            overflow-x: hidden;
            height: 100%;

            & > p {
                padding-left: 32px;
                padding-right: 32px;
                max-height: 100vh;
                font-size: 22px; font-weight: 300;
                text-align: center;
                opacity: 1;
                color: white;
                transition: all .43s ease-in-out;

                &.inactive {
                    max-height: 0vh;
                    opacity: 0;
                }
            }
        }
    }

   li.add-button {
        height: 48px; width: 48px;
        bottom: 85px;
        position: fixed;
        left: calc(50% - 24px);
        padding: 0;
        background-color: transparent !important;

       & > button.add {
            position: relative;
            display: block;
            margin-left: auto; margin-right: auto;
            width: 48px; height: 48px;
            background-color: #003D6A;
            border: 0; padding: 0;
            border-radius: 50%;
            opacity: .4;
            box-shadow: 0px 3px 0px #013256, 0px 4px 8px rgba(1, 50, 86, .45);
            transition: all .16s ease-in-out;
            user-select: none; outline: none;
            cursor: pointer;

            &:active, &:hover { opacity: 1; transition: all .16s ease-in-out; }
            &::before, &::after {
                content: "";
                position: absolute;
                background: #f1f1f1;
                border-radius: 2px;
                left: 50%; top: 50%;
            }

            &::before {
                width: 5px; height: 20px;
                margin-top: -10px; margin-left: -2.5px;
            }

           &::after {
                width: 20px; height: 5px;
                margin-left: -10px; margin-top: -2.5px;
            }
        }
    }

    footer {
        height: 64px; width: 100%;
        background-color: #697C84;
        padding: 16px 32px;
        display: flex; flex-flow: row nowrap;
        justify-content: space-between;
        .footer-links {
            width: 85px; height: 32px;
            margin-left: auto; margin-right: 0;
            display: inline-flex;
            flex-flow: row wrap;
            justify-content: space-between;
            a {
                height: auto; width: auto;
                max-height: 32px;
                img { height: 32px; width: auto; }
            }
        }
    }
</style>
