require 'xcodeproj'

project_path = 'MobileTodoList.xcodeproj'
project = Xcodeproj::Project.open(project_path)

target = project.targets.find { |t| t.name == 'MobileTodoList' }

# Fix font file paths in resources
target.resources_build_phase.files.each do |build_file|
  if build_file.file_ref && build_file.file_ref.path =~ /\.(ttf|otf)$/
    current_path = build_file.file_ref.path
    filename = File.basename(current_path)
    correct_path = "MobileTodoList/Fonts/#{filename}"
    
    if current_path != correct_path
      puts "Fixing: #{current_path} -> #{correct_path}"
      build_file.file_ref.path = correct_path
    end
  end
end

project.save
puts "\nFont paths updated!"
