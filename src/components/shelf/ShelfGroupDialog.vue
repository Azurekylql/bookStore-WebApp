
<template>
    <ebook-dialog :title="title" ref="dialog">
        <div class="dialog-list-wrapper" v-if="!ifNewGroup">
            <div v-for="(item, index) in categoryList" :key="index" @click="onGroupClick(item)">
                <div class="dialog-list-item" :class="{ 'is-add': item.edit ? item.edit === 1 : false }"
                    v-if="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit">
                    <div class="dialog-list-item-text">{{ item.title }}</div>
                    <div class="dialog-list-icon-wrapper" v-if="isInGroup && shelfCategory.id === item.id">
                        <span class="iconfont icon-check"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="dialog-new-group-wrapper" v-else>
            <div class="dialog-input-title-wrapper">
                <span class="dialog-input-title">{{ $t('shelf.groupName') }}</span>
            </div>
            <div class="dialog-input-wrapper">
                <div class="dialog-input-inner-wrapper">
                    <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput">
                    <div class="dialog-input-clear-wrapper" @click="clear" v-show="newGroupName && newGroupName.length > 0">
                        <span class="iconfont icon-close-circle-fill"></span>
                    </div>
                </div>
            </div>
        </div>

        <div slot="btn" class="group-dialog-btn-wrapper">
            <div class="dialog-btn" @click="hide">{{ $t('shelf.cancel') }}</div>
            <div class="dialog-btn" @click="createNewGroup"
                :class="{ 'is-empty': newGroupName && newGroupName.length === 0 }" v-if="ifNewGroup">{{ $t('shelf.confirm')
                }}
            </div>
        </div>
    </ebook-dialog>
</template>
  
<script>
/* eslint-disable */
import EbookDialog from '../common/Dialog';
import { storeShelfMixin } from '../../utils/mixin';
import { removeAddFromShelf, appendAddToShelf, computeId } from '../../utils/store';
import { saveBookShelf } from '../../utils/localStorage';

export default {
    name: 'group-dialog',
    mixins: [storeShelfMixin],
    components: {
        EbookDialog
    },
    props: {
        showNewGroup: {
            type: Boolean,
            default: false
        },
        groupName: String
    },
    computed: {
        isInGroup() {
            return this.currentType === 2;
        },
        defaultCategory() {
            return [
                {
                    title: this.$t('shelf.newGroup'),
                    edit: 1
                },
                {
                    title: this.$t('shelf.groupOut'),
                    edit: 2
                }
            ];
        },
        category() {
            return this.shelfList.filter(item => item.type === 2);
        },
        categoryList() {
            return [...this.defaultCategory, ...this.category];
        },
        title() {
            return !this.ifNewGroup ? this.$t('shelf.moveBook') : this.$t('shelf.newGroup');
        }
    },
    data() {
        return {
            ifNewGroup: false,
            newGroupName: ''
        };
    },
    methods: {
        show() {
            this.ifNewGroup = this.showNewGroup;
            this.newGroupName = this.groupName;
            this.$refs.dialog.show();
        },
        hide() {
            this.$refs.dialog.hide();
            setTimeout(() => {
                this.ifNewGroup = false;
            }, 200);
        },
        onGroupClick(item) {
            if (item.edit && item.edit === 1) {
                // item.edit === 1表示新增分组的按钮
                this.ifNewGroup = true;
            } else if (item.edit && item.edit === 2) {
                // item.edit === 2表示移出分组的按钮
                this.moveOutFromGroup();
            } else {
                // 加入分组的方法
                this.moveToGroup(item);
            }
        },
        clear() {
            this.newGroupName = '';
        },
        moveToGroup(group) {
            // group表示的就是选中的分组
            this.setShelfList(this.shelfList
                .filter(book => {
                    if (book.itemList) {
                        book.itemList = book.itemList.filter(subBook => this.shelfSelected.indexOf(subBook) < 0);
                    }
                    return this.shelfSelected.indexOf(book) < 0;
                }))
                .then(() => {
                    if (group && group.itemList) {
                        // 数组合并
                        group.itemList = [...group.itemList, ...this.shelfSelected];
                    }
                    group.itemList.forEach((item, index) => {
                        item.id = index + 1;
                    });
                    this.simpleToast(this.$t('shelf.moveBookInSuccess').replace('$1', group.title));
                    this.onComplete();
                });
        },
        moveOutFromGroup() {
            this.setShelfList(this.shelfList.map(book => {
                if (book.type === 2 && book.itemList) {
                    book.itemList = book.itemList.filter(item => !item.selected);
                }
                return book;
            })).then(() => {
                let list = removeAddFromShelf(this.shelfList); // 先把加号去掉 返回的是一个新数组
                list = [].concat(list, this.shelfSelected);  // 将当前的list和选中的图书数组做一个合并
                list = appendAddToShelf(list);
                computeId(list);  // 全部重新计算id
                this.setShelfList(list);
            }).then(() => {
                this.simpleToast(this.$t('shelf.moveBookOutSuccess'));
                this.onComplete();
            });
            // this.moveOutOfGroup(this.onComplete);
        },
        createNewGroup() {
            if (!this.newGroupName || this.newGroupName.length === 0) {
                return;
            }
            if (this.showNewGroup) {
                this.shelfCategory.title = this.newGroupName;
                this.onComplete();
            } else {
                // 新建一个group对象
                const group = {
                    id: this.shelfList[this.shelfList.length - 2].id + 1,
                    itemList: [],
                    selected: false,
                    title: this.newGroupName,
                    type: 2
                };
                let list = removeAddFromShelf(this.shelfList); // 先把加号去掉
                list.push(group);
                list = appendAddToShelf(list);  // 接着再将加号加回去
                this.setShelfList(list).then(() => {
                    this.moveToGroup(group);
                });
            }
        },
        onComplete() {
            saveBookShelf(this.shelfList);
            this.hide();
            this.setIsEditMode(false);
        }
    }
};
</script>
  
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.dialog-list-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    font-size: px2rem(14);
    @include scroll;

    .dialog-list-item {
        display: flex;
        padding: px2rem(15) 0;
        box-sizing: border-box;
        color: #666;

        &.is-add {
            color: $color-blue;

            &:active {
                color: $color-blue-transparent;
            }
        }

        &:active {
            color: rgba(102, 102, 102, .5)
        }

        .dialog-list-item-text {
            flex: 1;
        }

        .dialog-list-icon-wrapper {
            flex: 0 0 px2rem(30);
            color: $color-blue;
            @include right;
        }
    }
}

.dialog-new-group-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;

    .dialog-input-title-wrapper {
        font-size: px2rem(10);
        margin-top: px2rem(20);
    }

    .dialog-input-wrapper {
        width: 100%;
        padding: 0 0 px2rem(30) 0;
        box-sizing: border-box;

        .dialog-input-inner-wrapper {
            display: flex;
            width: 100%;
            padding: px2rem(10) 0;
            box-sizing: border-box;
            border-bottom: px2rem(1) solid #eee;
            font-size: px2rem(14);
            color: #666;

            .dialog-input {
                flex: 1;
                border: none;

                &:focus {
                    outline: none;
                }
            }

            .dialog-input-clear-wrapper {
                flex: 0 0 px2rem(30);
                color: #ccc;
                @include center;

                &:active {
                    color: #999;
                }
            }
        }
    }
}

.group-dialog-btn-wrapper {
    width: 100%;
    @include center;
}

.dialog-btn {
    flex: 1;

    &.is-empty {
        color: rgba(255, 255, 255, .5);
    }

    &:active {
        color: rgba(255, 255, 255, .5)
    }
}
</style>
  