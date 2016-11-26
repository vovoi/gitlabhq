require('./filtered_search_dropdown');

/* global droplabAjaxFilter */

(() => {
  class DropdownUser extends gl.FilteredSearchDropdown {
    constructor(droplab, dropdown, input, filter) {
      super(droplab, dropdown, input, filter);
      this.config = {
        droplabRemoteFilter: {
          endpoint: `${gon.relative_url_root || ''}/autocomplete/users.json`,
          searchKey: 'search',
          formatValue: this.getSearchInput.bind(this),
        },
        droplabAjax: {
          params: {
            per_page: 20,
            active: true,
            project_id: this.getProjectId(),
            current_user: true,
          },
          loadingTemplate: this.loadingTemplate,
        },
      };
    }

    itemClicked(e) {
      super.itemClicked(e,
        selected => selected.querySelector('.dropdown-light-content').innerText.trim());
    }

    renderContent(forceShowList = false) {
      this.droplab.changeHookList(this.hookId, this.dropdown, [droplabAjax, droplabRemoteFilter], this.config);
      super.renderContent(forceShowList);
    }

    getProjectId() {
      return this.input.getAttribute('data-project-id');
    }

    getSearchInput(input) {
      const { lastToken } = gl.FilteredSearchTokenizer.processTokens(input);
      let value = lastToken.value || '';

      // Removes the first character if it is a quotation so that we can search
      // with multiple words
      if (value[0] === '"' || value[0] === '\'') {
        value = value.slice(1);
      }

      return value;
    }

    init() {
      this.droplab.addHook(this.input, this.dropdown, [droplabAjax, droplabRemoteFilter], this.config).init();
    }
  }

  window.gl = window.gl || {};
  gl.DropdownUser = DropdownUser;
})();
