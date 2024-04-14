setup:
	@if command deno -V &> /dev/null; then \
		echo "deno is already installed"; \
	else \
		brew install deno; \
	fi

install: setup
	sh install.sh
	ln -sf ${PWD}/com.mrskiro.on-air.plist ${HOME}/Library/LaunchAgents/com.mrskiro.on-air.plist
	launchctl load ${HOME}/Library/LaunchAgents/com.mrskiro.on-air.plist

uninstall:
	launchctl unload ${HOME}/Library/LaunchAgents/com.mrskiro.on-air.plist
	rm -f ${HOME}/Library/LaunchAgents/com.mrskiro.on-air.plist

log-clear:
	@find . -name '*.log' -exec sh -c 'cat /dev/null > "$$0"' {} \;
